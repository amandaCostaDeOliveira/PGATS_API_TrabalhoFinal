// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const authController = require('./controller/authController');
const taskController = require('./controller/taskController');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./service/authService');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

// Swagger setup (agora usando o swagger.json)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
app.post('/register', authController.register);
app.post('/login', authController.login);

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

// Task routes (protegidas)
app.post('/tasks', authenticateToken, taskController.createTask);
app.get('/tasks', authenticateToken, taskController.getTasks);
app.get('/tasks/:id', authenticateToken, taskController.getTaskById);
app.put('/tasks/:id', authenticateToken, taskController.updateTask);
app.delete('/tasks/:id', authenticateToken, taskController.deleteTask);
app.post('/tasks/:id/complete', authenticateToken, taskController.completeTask);

module.exports = app;
