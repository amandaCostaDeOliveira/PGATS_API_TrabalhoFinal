// bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// aplicação
const app = require('../../../app');

// modelos para limpar o "banco" antes da suíte
const users = require('../../../model/userModel');
const tasks = require('../../../model/taskModel');

describe('Testes de cenários felizes da API Rest a nível de Controller', () => {

    // Limpeza do banco antes de todos os testes
    before(() => {
        users.length = 0;
        tasks.length = 0;
    });

    // Dados para testes de registro de usuário
    const usuarios = [
        { username: 'Amanda', password: '123456' },
        { username: 'Bruno', password: 'abcdef' }
    ];

    usuarios.forEach(usuario => {
        it(`Registrar usuário "${usuario.username}" com sucesso`, async () => {
            const resposta = await request(app)
                .post('/register')
                .send(usuario);

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('message', 'Usuário registrado com sucesso.');
        });
    });

    // Dados para testes de login
    const logins = [
        { username: 'Amanda', password: '123456' },
        { username: 'Bruno', password: 'abcdef' }
    ];

    logins.forEach(login => {
        it(`Login do usuário "${login.username}"`, async () => {
            const resposta = await request(app)
                .post('/login')
                .send(login);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token');
        });
    });

    // Dados para criação de tasks
    const tarefas = [
        {
            usuario: { username: 'Amanda', password: '123456' },
            task: {
                title: 'Criação da API Rest',
                description: 'Primeira etapa do trabalho final',
                dueDate: '2025-09-21',
                priority: 'Alta'
            }
        },
        {
            usuario: { username: 'Bruno', password: 'abcdef' },
            task: {
                title: 'Criação dos Testes automatizados da API Rest a Nível de Controller',
                description: 'Segunda etapa do trabalho final',
                dueDate: '2025-09-21',
                priority: 'Alta'
            }
        }
    ];

    tarefas.forEach(({ usuario, task }) => {
        it(`Criar task para "${usuario.username}"`, async () => {
            // Primeiro faz login para obter token
            const loginRes = await request(app).post('/login').send(usuario);
            const token = loginRes.body.token;

            const resposta = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send(task);

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.include({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                status: 'pending'
            });
            expect(resposta.body).to.have.property('id');
        });
    });

    // Dados para atualizar task
    const atualizacoes = [
        {
            usuario: { username: 'Amanda', password: '123456' },
            task: {
                title: 'Criação da API Rest que será exposta também como GraphQL',
                description: 'Primeira etapa do trabalho final',
                dueDate: '2025-09-21',
                priority: 'Alta',
                status: 'pending'
            }
        }
    ];

    atualizacoes.forEach(({ usuario, task }) => {
        it(`Atualizar task para "${usuario.username}"`, async () => {
            const loginRes = await request(app).post('/login').send(usuario);
            const token = loginRes.body.token;

            // Criar uma task antes de atualizar
            const createRes = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Temp Task',
                    description: 'Temp description',
                    dueDate: '2025-09-21',
                    priority: 'Alta'
                });
            const taskId = createRes.body.id;

            const resposta = await request(app)
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(task);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.include({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                status: task.status
            });
        });
    });

    // Dados para concluir task
    const conclusoes = [
        { usuario: { username: 'Amanda', password: '123456' } }
    ];

    conclusoes.forEach(({ usuario }) => {
        it(`Concluir task do usuário "${usuario.username}"`, async () => {
            const loginRes = await request(app).post('/login').send(usuario);
            const token = loginRes.body.token;

            // Criar uma task antes de concluir
            const createRes = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Task para concluir',
                    description: 'Descrição qualquer',
                    dueDate: '2025-09-21',
                    priority: 'Alta'
                });
            const taskId = createRes.body.id;

            const resposta = await request(app)
                .post(`/tasks/${taskId}/complete`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('message', 'Task marcada como concluída.');
        });
    });
});
