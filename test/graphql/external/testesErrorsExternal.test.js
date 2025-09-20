import request from "supertest";
import dotenv from "dotenv";
import { expect } from "chai";  // ✅ necessário para os asserts

dotenv.config();

const BASE_URL_GRAPHQL = process.env.BASE_URL_GRAPHQL;

describe("Testes de cenários de erros da API GraphQL a nível external", () => {
  let token;

  beforeEach(async () => {
    // registra usuário antes de cada teste
    await request(BASE_URL_GRAPHQL)
      .post("/")
      .send({
        query: `
          mutation Register($username: String!, $password: String!) {
            register(username: $username, password: $password)
          }
        `,
        variables: {
          username: "Amanda",
          password: "123456",
        },
      });

    // login correto para capturar token (usado nos testes 2 e 3)
    const res = await request(BASE_URL_GRAPHQL)
      .post("/") 
      .send({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }
        `,
        variables: {
          username: "Amanda",
          password: "123456",
        },
      });

    token = res.body.data?.login?.token;
  });

  it("1 - Login com credenciais inválidas deve falhar", async () => {
    const res = await request(BASE_URL_GRAPHQL)
      .post("/") 
      .send({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }
        `,
        variables: {
          username: "Amanda",
          password: "654321",
        },
      });

    expect(res.body.errors).to.be.an("array");
    expect(res.body.errors[0].message).to.equal("Credenciais inválidas.");
    expect(res.body.data).to.be.null;
  });

  it("2 - Tentativa de deletar task inexistente deve falhar", async () => {
    const res = await request(BASE_URL_GRAPHQL)
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation DeleteTask($deleteTaskId: ID!) {
            deleteTask(id: $deleteTaskId)
          }
        `,
        variables: {
          deleteTaskId: 123456,
        },
      });

    expect(res.body.errors).to.be.an("array");
    expect(res.body.errors[0].message).to.equal("Task não encontrada.");
    expect(res.body.data).to.be.null;
  });

  it("3 - Tentativa de atualizar task inexistente deve falhar", async () => {
    const res = await request(BASE_URL_GRAPHQL)
      .post("/") 
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          mutation UpdateTask($updateTaskId: ID!) {
            updateTask(id: $updateTaskId) {
              id
            }
          }
        `,
        variables: {
          updateTaskId: 123456,
        },
      });

    expect(res.body.errors).to.be.an("array");
    expect(res.body.errors[0].message).to.equal("Task não encontrada.");
    expect(res.body.data).to.be.null;
  });
});
