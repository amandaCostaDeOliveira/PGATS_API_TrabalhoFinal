// graphql/server.js
const app = require('./app');

const PORT = process.env.PORT_GRAPHQL || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL API rodando em http://localhost:${PORT}/graphql`);
});
