// bibliotecas
const request = require("supertest");
const { expect } = require("chai");

// aplicação (importa o app do graphql/app.js, sem o listen)
const app = require("../../../graphql/app");

describe("Testes de cenários felizes da API GraphQL a nível de Controller", () => {
  it("Registrar usuário com sucesso", async () => {
    const query = `
      mutation Mutation($username: String!, $password: String!) {
        register(username: $username, password: $password)
      }
    `;
    const variables = {
      username: "Amanda",
      password: "123456"
    };

    const res = await request(app)
      .post("/graphql")
      .send({ query, variables });

    expect(res.status).to.equal(200);
    expect(res.body.data.register).to.equal("Usuário registrado com sucesso.");
  });

  it("Login com sucesso e retorno do token", async () => {
    const query = `
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `;
    const variables = {
      username: "Amanda",
      password: "123456"
    };

    const res = await request(app)
      .post("/graphql")
      .send({ query, variables });

    expect(res.status).to.equal(200);
    expect(res.body.data.login).to.have.property("token");
    expect(res.body.data.login.token).to.be.a("string");
  });

  it("Criar task com sucesso", async () => {
    const loginQuery = `
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `;
    const loginVars = { username: "Amanda", password: "123456" };

    const loginRes = await request(app)
      .post("/graphql")
      .send({ query: loginQuery, variables: loginVars });

    const token = loginRes.body.data.login.token;

    const createTaskQuery = `
      mutation CreateTask($title: String!, $dueDate: String!, $description: String, $priority: String) {
        createTask(title: $title, dueDate: $dueDate, description: $description, priority: $priority) {
          id
          ownerUsername
          title
          description
          dueDate
          priority
          status
        }
      }
    `;
    const createTaskVars = {
      title: "Testes Controller API GraphQL",
      dueDate: "21/09/2025",
      priority: "Alta",
      description: "Quinta parte do trabalho final"
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({ query: createTaskQuery, variables: createTaskVars });

    expect(res.status).to.equal(200);
    expect(res.body.data.createTask).to.include({
      ownerUsername: "Amanda",
      title: "Testes Controller API GraphQL",
      description: "Quinta parte do trabalho final",
      dueDate: "21/09/2025",
      priority: "Alta",
      status: "pending"
    });
    expect(res.body.data.createTask).to.have.property("id");
  });
});
