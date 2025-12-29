### Trabalho de Conclusão da Disciplina

Ei Júlio!! Eu fiz a pós graduação assistindo as aulas gravadas e essa foi a única disciplina que não consegui cumprir o primeiro prazo da entrega do trabalho. Porém, assim como nas demais disciplinas, fiz com muita dedicação e tentando absorver todo o conteúdo da disciplina. Então, tardando mas não falhando, rsrs, bora para a entrega do trabalho final:
---
**Orientações:** **Desafio:**

Implemente ao menos UM teste automatizado de performance com K6 para um dos seus projetos de API construídos no decorrer do curso. Esse projeto de testes de performance deve usar o K6 para exercitar a API.

**Minha API Escolhida:**

Para a realização deste trabalho, optei por testar a performance da To-Do List API, criada por mim na disciplina de Automação de Testes API. É uma API para gerenciamento de tarefas (To-Do List), com autenticação JWT, documentação Swagger e banco de dados em memória. Os endpoints são:

- `POST /register` — Cadastro de usuário
- `POST /login` — Login e obtenção do token JWT
- `POST /tasks` — Criar nova tarefa (autenticado)
- `GET /tasks` — Listar tarefas do usuário (autenticado)
- `GET /tasks/:id` — Detalhes de uma tarefa (autenticado)
- `PUT /tasks/:id` — Editar tarefa (autenticado)
- `DELETE /tasks/:id` — Excluir tarefa (autenticado)
- `POST /tasks/:id/complete` — Marcar tarefa como concluída (autenticado)

Para este trabalho de conclusão da disciplina de Automação de Testes de Performance, eu optei por testar o fluxo completo do usuário na ToDo List API. Ou seja: registrar o usuário → fazer login → criar uma tarefa nova → listar todas as tarefas do usuário → buscar a última tarefa pelo id → editar a última tarefa → concluir a última tarefa → deletar a última tarefa. Este cenário foi pensado para representar o uso real end-to-end da API, porém este não é um sistema de milhões de usuário, então foi definida uma carga moderada, visando mostrar como o sistema se comporta com mais usuários simultâneos e se os critérios de resposta irão passar. 


**Conceitos empregados:**

Conforme proposto no trabalho final, abaixo descrevo pelo menos um exemplo mostrando onde no código cada um dos conceitos foram aplicados:

**Thresholds**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Thresholds, métricas pensadas para medir o sucesso da performance da minha API TO-DO list. Os parâmetros definidos como sucesso indicam que 90% das requisições devem durar até 500ms, 95% delas devem durar até 800ms, devem ocorrer no máximo 1% de falhas e pelo menos 99% dos checks devem passar.

thresholds: {
    http_req_duration: ['p(90)<500', 'p(95)<800'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  }

**Checks**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Checks, neste caso, estou validando que a API respondeu e que a resposta tem dados reais a serem trabalhados nos próximos endpoints.

check(responseGetTasks, {
  'Listagem das tasks retorna 200': (res) => res.status === 200,
  'E lista possui ao menos 1 task':
    (res) => Array.isArray(res.json()) && res.json().length > 0
});

**Helpers**
O código abaixo está armazenado no arquivo performance\k6\helpers\postLogin.js e demontra o uso do conceito de Helpers, neste caso uma função de login, que poderá ser reaproveitada em outras partes do código.

import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function postLogin(username, password) {
    return http.post(
        `${BASE_URL}/login`,
        JSON.stringify({ username, password }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

**Trends**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Trends, neste caso foi uma métrica customizada para avaliar a performance do post tasks isoladamente dos demais.

import { Trend } from 'k6/metrics';

const postTasksDurationTrend = new Trend('post_tasks_duration');

postTasksDurationTrend.add(responseTasks.timings.duration)


**Faker**
O código abaixo está armazenado no arquivo performance\k6\helpers\randomUser.js e demontra o uso do conceito de Faker me auxiliando na criação de usuário aleatório para ser registrado na minha API, gerando um username e uma senha.

import faker from 'k6/x/faker';

export function randomUser() {

    const usuario = faker.person.name();
    const username = `${usuario} ${Date.now()}`;

    const password = faker.internet.password(
    true,   // lower
    true,   // upper
    true,   // numeric
    false,  // special
    false,  // space
    10      
  );

  return { username, password };
}

**Variável de Ambiente**
O código abaixo está armazenado no arquivo performance\k6\helpers\baseURL.js e demontra o uso do conceito de Variável de ambiente, no caso me permite alterar o ambiente de execução dos testes sem mudar o código.

export const BASE_URL = __ENV.BASE_URL_REST || 'http://localhost:3000';

**Stages**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Stages, me auxiliando a simular o comportamento real de usuários ao longo do tempo.

    stages: [
    { duration: '1m', target: 5 },   // aquecimento: sobe até 5 VUs
    { duration: '2m', target: 10 },  // carga "normal": 10 VUs constantes
    { duration: '2m', target: 20 },  // pico: aumenta para 20 VUs
    { duration: '2m', target: 10 },  // descida controlada: volta para 10 VUs
    { duration: '1m', target: 0 },   // resfriamento: volta para 0
    ],

**Reaproveitamento de Resposta**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Reaproveitamento de resposta, neste caso, eu estou capturando o ID da última tarefa do usuário para reaproveitar nos próximos endpoints.

const tasks = responseGetTasks.json();
if (Array.isArray(tasks) && tasks.length > 0) {
  lastTaskId = tasks[tasks.length - 1].id;
}

http.get(`${BASE_URL}/tasks/${lastTaskId}`, ...)
http.put(`${BASE_URL}/tasks/${lastTaskId}`, ...)
http.post(`${BASE_URL}/tasks/${lastTaskId}/complete`, ...)
http.del(`${BASE_URL}/tasks/${lastTaskId}`, ...)

**Uso de Token de Autenticação**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de uso do token de autenticação, primeiro ele foi extraído do response do login e utilizado em todos os endpoints que necessitam de autenticação, no caso abaixo, no EP de listagem das tarefas.

responseLogin.json('token')

    group('4) Listar todas as tarefas do usuário', () => {
        const responseGetTasks = http.get(
            `${BASE_URL}/tasks`,
            {
                headers: {
                    'Authorization': `Bearer ${responseLogin.json('token')}`
                }
            }
        );

**Data-Driven Testing**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Data-driven Testing, pois está recebendo os dados provenientes do arquivo externo performance\k6\data\tasks.js referente à criação das tarefas na API.

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



**Groups**
O código abaixo está armazenado no arquivo performance\k6\trabalho-final.js e demontra o uso do conceito de Groups, neste trabalho, foram criados 9 gorups que auxiliam na organização e na estruturação do fluxo do usuário, no exemplo abaixo, o group é destinado à exclusão da tarefa.

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






