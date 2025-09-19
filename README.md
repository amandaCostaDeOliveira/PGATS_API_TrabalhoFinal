# To-Do List API

API com exposição REST e GraphQL para gerenciamento de tarefas (To-Do List) com autenticação JWT, documentação Swagger a partir de `swagger.json` e banco de dados em memória.

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
npm install

## Orientação
Antes de seguir, crie um arquivo .env na raiz do projeto contendo as propriedades BASE_URL_REST e BASE_URL_GRAPHQL com a URL destes serviços.

## Como rodar a API

- Para rodar em modo desenvolvimento (com auto-reload):
npx nodemon server.js

- Para rodar normalmente:
node server.js

## Documentação Swagger

Acesse a documentação interativa (gerada a partir de `swagger.json`)

## Endpoints principais

- `POST /register` — Cadastro de usuário
- `POST /login` — Login e obtenção do token JWT
- `POST /tasks` — Criar nova tarefa (autenticado)
- `GET /tasks` — Listar tarefas do usuário (autenticado)
- `GET /tasks/:id` — Detalhes de uma tarefa (autenticado)
- `PUT /tasks/:id` — Editar tarefa (autenticado)
- `DELETE /tasks/:id` — Excluir tarefa (autenticado)
- `POST /tasks/:id/complete` — Marcar tarefa como concluída (autenticado)

## Observações

- O banco de dados é em memória (os dados são perdidos ao reiniciar o servidor).
- Todos os endpoints de tarefas exigem autenticação JWT (enviar header: `Authorization: Bearer <token>`).
- A documentação Swagger está vinculada ao arquivo `swagger.json`, facilitando manutenção e testes automatizados.

---

Dúvidas? Consulte o código ou a documentação Swagger!
