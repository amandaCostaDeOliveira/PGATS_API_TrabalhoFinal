// graphql/app.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();
app.use(express.json());

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // JWT via header Authorization: Bearer <token>
      const auth = req.headers.authorization || '';
      const token = auth.split(' ')[1];
      let user = null;
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const { SECRET } = require('../service/authService');
          user = jwt.verify(token, SECRET);
        } catch (e) {
          // Token inválido, user continua null
        }
      }
      return { user };
    },
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

startApolloServer();

module.exports = app;
