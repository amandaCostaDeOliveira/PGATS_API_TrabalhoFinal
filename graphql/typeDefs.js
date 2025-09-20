// graphql/typeDefs.js
const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
  }

  type Task {
    id: ID!
    ownerUsername: String!
    title: String!
    description: String
    dueDate: String!
    priority: String!
    status: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    getTasks: [Task!]!
    getTaskById(id: ID!): Task
  }

  type Mutation {
    register(username: String!, password: String!): String!
    login(username: String!, password: String!): AuthPayload!
    createTask(title: String!, description: String, dueDate: String!, priority: String): Task!
    updateTask(id: ID!, title: String, description: String, dueDate: String, priority: String, status: String): Task!
    deleteTask(id: ID!): String!
    completeTask(id: ID!): String!
  }
`;
