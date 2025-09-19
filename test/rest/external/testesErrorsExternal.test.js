// bibliotecas
const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

const BASE_URL = process.env.BASE_URL_REST;

describe('Testes de cenários de erros da API Rest a nível external', () => {

    before(async () => {
        // Registrar usuário Amanda (ignora erro se já existir)
        await request(BASE_URL)
            .post('/register')
            .send({ username: "Amanda", password: "123456" })
            .catch(() => {});
    });

    it('Login com credenciais inválidas deve retornar 401', async () => {
        const res = await request(BASE_URL)
            .post('/login')
            .send({ username: "Amanda", password: "654321" });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'Credenciais inválidas.');
    });

    it('Não deve permitir criar task com título repetido', async () => {
        // login válido para obter token
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ username: "Amanda", password: "123456" });

        const token = loginRes.body.token;
        expect(token).to.exist;

        // cria a primeira vez com sucesso
        await request(BASE_URL)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Criação da API Rest",
                description: "Primeira etapa do trabalho final",
                dueDate: "2025-09-21",
                priority: "Alta"
            });

        // tenta criar novamente a mesma task
        const res = await request(BASE_URL)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Criação da API Rest",
                description: "Primeira etapa do trabalho final",
                dueDate: "2025-09-21",
                priority: "Alta"
            });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message', 'Já existe uma task com esse título para este usuário.');
    });

    it('GET /tasks sem token deve retornar 401', async () => {
        const res = await request(BASE_URL)
            .get('/tasks');

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'Token não fornecido.');
    });

});
