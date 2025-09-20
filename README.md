
# To-Do List API

API com exposição REST e GraphQL para gerenciamento de tarefas (To-Do List) com autenticação JWT, documentação Swagger e banco de dados em memória.


## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
	```
	npm install
	```
3. Para GraphQL, instale também:
	```
	npm install apollo-server-express@3 graphql express@4
	```


## Orientação
Antes de seguir, crie um arquivo .env na raiz do projeto contendo as propriedades BASE_URL_REST e BASE_URL_GRAPHQL com a URL destes serviços.


## Como rodar a API REST

- Para rodar em modo desenvolvimento (com auto-reload):
	```
	npx nodemon server.js
	```
- Para rodar normalmente:
	```
	node server.js
	```

## Como rodar a API GraphQL

- Entre na pasta `graphql`:
	```
	cd graphql
	```
- Para rodar em modo desenvolvimento:
	```
	npx nodemon server.js
	```
- Para rodar normalmente:
	```
	node server.js
	```
- Acesse: [http://localhost:4000/graphql](http://localhost:4000/graphql)


## Documentação Swagger

Acesse a documentação interativa em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)


## Endpoints principais (REST)

- `POST /register` — Cadastro de usuário
- `POST /login` — Login e obtenção do token JWT
- `POST /tasks` — Criar nova tarefa (autenticado)
- `GET /tasks` — Listar tarefas do usuário (autenticado)
- `GET /tasks/:id` — Detalhes de uma tarefa (autenticado)
- `PUT /tasks/:id` — Editar tarefa (autenticado)
- `DELETE /tasks/:id` — Excluir tarefa (autenticado)
- `POST /tasks/:id/complete` — Marcar tarefa como concluída (autenticado)

## Operações principais (GraphQL)

### Mutations
- `register(username, password): String` — Cadastro de usuário
- `login(username, password): AuthPayload` — Login e obtenção do token JWT
- `createTask(...)` — Criar nova tarefa (autenticado)
- `updateTask(...)` — Editar tarefa (autenticado)
- `deleteTask(id)` — Excluir tarefa (autenticado)
- `completeTask(id)` — Marcar tarefa como concluída (autenticado)

### Queries
- `getTasks` — Listar tarefas do usuário autenticado
- `getTaskById(id)` — Detalhes de uma tarefa (autenticado)

**Exemplo de uso (GraphQL Playground):**

```graphql
mutation {
	register(username: "Amanda", password: "123456")
}

mutation {
	login(username: "Amanda", password: "123456") {
		token
	}
}

query {
	getTasks {
		id
		title
		status
	}
}
```


## Observações

- O banco de dados é em memória (os dados são perdidos ao reiniciar o servidor).
- Todos os endpoints de tarefas exigem autenticação JWT (enviar header: `Authorization: Bearer <token>`).
- Para GraphQL, envie o header `Authorization: Bearer <token>` nas requisições autenticadas.
- A documentação Swagger está disponível para a API REST.

---

Dúvidas? Consulte o código ou a documentação Swagger!
