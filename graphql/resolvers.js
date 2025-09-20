// graphql/resolvers.js
const users = require('../model/userModel');
const tasks = require('../model/taskModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { SECRET } = require('../service/authService');

function getUserFromToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = {
  Query: {
    getTasks: (_, __, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      return tasks.filter(t => t.ownerUsername === user.username);
    },
    getTaskById: (_, { id }, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      const task = tasks.find(t => t.id === id && t.ownerUsername === user.username);
      if (!task) throw new Error('Task não encontrada.');
      return task;
    },
  },
  Mutation: {
    register: (_, { username, password }) => {
      if (!username || !password) throw new Error('Username e password são obrigatórios.');
      if (users.find(u => u.username === username)) throw new Error('Usuário já existe.');
      const hashed = bcrypt.hashSync(password, 8);
      users.push({ username, password: hashed });
      return 'Usuário registrado com sucesso.';
    },
    login: (_, { username, password }) => {
      if (!username || !password) throw new Error('Username e password são obrigatórios.');
      const user = users.find(u => u.username === username);
      if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Credenciais inválidas.');
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      return { token };
    },
    createTask: (_, { title, description, dueDate, priority }, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      if (!title) throw new Error('O campo title é obrigatório.');
      if (tasks.find(t => t.ownerUsername === user.username && t.title === title)) throw new Error('Já existe uma task com esse título para este usuário.');
      if (!dueDate || new Date(dueDate) < new Date(new Date().toISOString().split('T')[0])) throw new Error('dueDate inválido ou no passado.');
      const task = {
        id: uuidv4(),
        ownerUsername: user.username,
        title,
        description: description || '',
        dueDate,
        priority: priority || 'low',
        status: 'pending',
      };
      tasks.push(task);
      return task;
    },
    updateTask: (_, { id, title, description, dueDate, priority, status }, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      const task = tasks.find(t => t.id === id && t.ownerUsername === user.username);
      if (!task) throw new Error('Task não encontrada.');
      if (title && tasks.find(t => t.ownerUsername === user.username && t.title === title && t.id !== task.id)) throw new Error('Já existe uma task com esse título para este usuário.');
      if (dueDate && new Date(dueDate) < new Date(new Date().toISOString().split('T')[0])) throw new Error('dueDate inválido ou no passado.');
      if (title) task.title = title;
      if (description) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      return task;
    },
    deleteTask: (_, { id }, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      const idx = tasks.findIndex(t => t.id === id && t.ownerUsername === user.username);
      if (idx === -1) throw new Error('Task não encontrada.');
      tasks.splice(idx, 1);
      return 'Task excluída com sucesso.';
    },
    completeTask: (_, { id }, { user }) => {
      if (!user) throw new Error('Não autenticado.');
      const task = tasks.find(t => t.id === id && t.ownerUsername === user.username);
      if (!task) throw new Error('Task não encontrada.');
      if (task.status === 'done') throw new Error('Task já está concluída.');
      task.status = 'done';
      return 'Task marcada como concluída.';
    },
  },
};
