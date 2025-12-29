import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { randomUser } from './helpers/randomUser.js'
import { postLogin } from './helpers/postLogin.js'
import { postRegister } from './helpers/postRegister.js'
import { BASE_URL } from './helpers/baseURL.js';
import { postTasks } from './helpers/postTasks.js'
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import tasks from './data/tasks.js';

const tasksData = new SharedArray('tasks data', () => {
    return tasks;
});

const postTasksDurationTrend = new Trend('post_tasks_duration');

export const options = {
    //Configuração para um teste de Fluxo Completo de Usuário na ToDo List API
    stages: [
        { duration: '1m', target: 5 },   // aquecimento: sobe até 5 VUs
        { duration: '2m', target: 10 },  // carga "normal": 10 VUs constantes
        { duration: '2m', target: 20 },  // pico: aumenta para 20 VUs
        { duration: '2m', target: 10 },  // descida controlada: volta para 10 VUs
        { duration: '1m', target: 0 },   // resfriamento: volta para 0
    ],
    thresholds: {
        http_req_duration: ['p(90)<500', 'p(95)<800'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
    },

    //outra opção de cenário com VUs e duration:
    // vus: 15,              
    //duration: '5m',      
    //iterations: 10,
    //thresholds: {
    //http_req_duration: ['p(90)<600', 'p(95)<1000'],
    //http_req_failed: ['rate<0.01'],
    //checks: ['rate>0.99'],
    //},
};

export default function () {
    const { username, password } = randomUser();

    let responseLogin = null;
    let responseRegister = null;
    let lastTaskId = null;

    group('1) Criando usuário', () => {
        responseRegister = postRegister(username, password);
        check(responseRegister, {
            'Registro do usuário retorna 201': (res) => res.status === 201
        });
    });

    group('2) Fazendo login', () => {
        responseLogin = postLogin(username, password);
        check(responseLogin, {
            'Login retorna 200': (res) => res.status === 200,
        });
    });

    group('3) Adicionando Tarefas', () => {
        const index = __ITER % tasksData.length;
        const taskData = tasksData[index];

        const responseTasks = postTasks(
            {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                priority: taskData.priority,
            },
            responseLogin.json('token')
        );

        check(responseTasks, {
            'Registro da task retorna 201': (res) => res.status === 201,
        });

        postTasksDurationTrend.add(responseTasks.timings.duration);
    });


    group('4) Listar todas as tarefas do usuário', () => {
        const responseGetTasks = http.get(
            `${BASE_URL}/tasks`,
            {
                headers: {
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

        check(responseGetTasks, {
            'Listagem das tasks retorna 200': (res) => res.status === 200,
            'E lista possui ao menos 1 task': (res) => Array.isArray(res.json()) && res.json().length > 0
        });

        const tasks = responseGetTasks.json();
        if (Array.isArray(tasks) && tasks.length > 0) {
            lastTaskId = tasks[tasks.length - 1].id;
        }
    });

    group('5) Obter detalhes da última tarefa', () => {
        if (!lastTaskId) return;

        const responseGetTaskById = http.get(
            `${BASE_URL}/tasks/${lastTaskId}`,
            {
                headers: {
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

        check(responseGetTaskById, {
            'Busca de task por id retorna 200': (res) => res.status === 200,
        });

    });

    group('6) Editar a última tarefa', () => {
        if (!lastTaskId) return;

        const responseUpdateTask = http.put(
            `${BASE_URL}/tasks/${lastTaskId}`,
            JSON.stringify({
                title: `Trabalho Final PGATS - EDITADO - ${Date.now()}`,
                description:
                    'Entrega do trabalho final da disciplina de Testes de Performance (editada)',
                dueDate: '2025-12-29',
                priority: 'high',
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

        check(responseUpdateTask, {
            'Edição da task retorna 200': (res) => res.status === 200,
        });
    });

    group('7) Concluir a última tarefa', () => {
        if (!lastTaskId) return;

        const responseCompleteTask = http.post(
            `${BASE_URL}/tasks/${lastTaskId}/complete`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

        check(responseCompleteTask, {
            'Conclusão da task retorna 200': (res) => res.status === 200,
        });
    });

    group('8) Excluir a última tarefa', () => {
        if (!lastTaskId) return;

        const responseDeleteTask = http.del(
            `${BASE_URL}/tasks/${lastTaskId}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

        check(responseDeleteTask, {
            'Exclusão da task retorna 200': (res) => res.status === 200,
        });
    });

    group('9) Simulando o pensamento do usuário', () => {
        sleep(1);
    })
}