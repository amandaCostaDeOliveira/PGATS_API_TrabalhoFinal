# AI Coding Agent Instructions

These instructions orient AI agents to work productively in this project.
Keep changes minimal and aligned with the existing style.

## Architecture Overview
- **REST API**: Express app in [app.js](app.js) with routes for auth and tasks; server entry in [server.js](server.js).
- **GraphQL API**: Apollo Server integrated with Express in [graphql/app.js](graphql/app.js); schema in [graphql/typeDefs.js](graphql/typeDefs.js); resolvers in [graphql/resolvers.js](graphql/resolvers.js); server entry in [graphql/server.js](graphql/server.js).
- **Controllers/Services**: REST routes map to controllers ([controller/*.js](controller)) which proxy to services ([service/*.js](service)) implementing validation and business logic.
- **Models (In-Memory)**: Arrays in [model/userModel.js](model/userModel.js) and [model/taskModel.js](model/taskModel.js). Data resets when server restarts; tests often clear arrays.
- **Auth (JWT)**: Secret from `service/authService.js` (`SECRET`) used by REST middleware in [app.js](app.js#L14-L29) and GraphQL `context` in [graphql/app.js](graphql/app.js#L9-L27).
- **Docs (Swagger)**: REST endpoints documented via [swagger.json](swagger.json) served at `/api-docs`.

## Conventions & Patterns
- **Language**: Responses and error messages are in Portuguese (e.g., `"Token não fornecido."`, `"Usuário já existe."`).
- **Status Codes**: REST uses `201` for creates, `400` for validation errors, `401` for auth failures, `404` for not found.
- **Validation**:
  - REST date check via `isPast()` in [service/taskService.js](service/taskService.js#L4-L6) using ISO date strings (`YYYY-MM-DD`).
  - GraphQL resolvers perform similar date checks in [graphql/resolvers.js](graphql/resolvers.js).
- **Auth Flow**:
  - Register: `POST /register` → hashes password (bcrypt) and stores in memory.
  - Login: `POST /login` → returns JWT with `username`.
  - Protected routes use `Authorization: Bearer <token>`.
- **Controller Delegation**: Controllers forward to services directly (see [controller/authController.js](controller/authController.js) and [controller/taskController.js](controller/taskController.js)).

## Developer Workflows
- **Install**:
  - Base: `npm install`
  - GraphQL deps if needed: `npm install apollo-server-express@3 graphql express@4`
- **Run**:
  - REST: `npm run start-rest` → listens on `PORT` or `3000`; Swagger at `/api-docs`.
  - GraphQL: `npm run start-graphql` → listens on `PORT_GRAPHQL` or `4000`; endpoint at `/graphql`.
- **Env for External Tests**: Create `.env` with:
  - `BASE_URL_REST` (e.g., `http://localhost:3000`)
  - `BASE_URL_GRAPHQL` (e.g., `http://localhost:4000`)
- **Test (Mocha + Supertest + Chai)**:
  - All: `npm test`
  - REST controller: `npm run test-rest-controller`
  - REST external: `npm run test-rest-external`
  - GraphQL controller: `npm run test-graphql-controller`
  - GraphQL external: `npm run test-graphql-external`
- **Reports**: Mochawesome outputs to [mochawesome-report/](mochawesome-report) with `mochawesome.html` and `mochawesome.json`.

## Key Files to Reference
- **Auth**: [service/authService.js](service/authService.js) (register/login, `SECRET`).
- **REST Middleware**: `authenticateToken` in [app.js](app.js#L18-L29).
- **Task Logic**: [service/taskService.js](service/taskService.js) (CRUD + complete).
- **GraphQL**: [graphql/typeDefs.js](graphql/typeDefs.js) and [graphql/resolvers.js](graphql/resolvers.js) for schema and behavior.
- **Swagger**: [swagger.json](swagger.json) for REST contract.
- **Tests**: 
  - REST controller happy paths in [test/rest/controller/testesFelizesController.test.js](test/rest/controller/testesFelizesController.test.js).
  - REST external error scenarios in [test/rest/external/testesErrorsExternal.test.js](test/rest/external/testesErrorsExternal.test.js).
  - GraphQL controller tests in [test/graphql/controller/testesFelizesController.test.js](test/graphql/controller/testesFelizesController.test.js).
  - GraphQL external error scenarios in [test/graphql/external/testesErrorsExternal.test.js](test/graphql/external/testesErrorsExternal.test.js).

## Implementation Notes
- **In-Memory DB**: Clear arrays (`users.length = 0; tasks.length = 0;`) for test isolation.
- **Error Messaging**: Match exact Portuguese strings as asserted in tests.
- **JWT Payload**: Only `username` is signed; downstream code expects `req.user.username`.
- **Dates**: Prefer ISO (`YYYY-MM-DD`) in REST; GraphQL tests provide non-ISO examples—ensure parser tolerates them if adjusting.

## Examples
- **Creating a task (REST)**: send JSON with `title`, `dueDate`, optional `description`, `priority` and include Bearer token; expect `201` and full task object (see [service/taskService.js](service/taskService.js)).
- **GraphQL createTask**: send mutation with Bearer token to `/graphql`; returns full `Task` (see [graphql/resolvers.js](graphql/resolvers.js)).

If any part is unclear or missing (e.g., performance/JMeter specifics), tell me what you want documented and I’ll refine this file. 