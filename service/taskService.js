// service/taskService.js
const tasks = require('../model/taskModel');
const { v4: uuidv4 } = require('uuid');

function isPast(dateStr) {
  return new Date(dateStr) < new Date(new Date().toISOString().split('T')[0]);
}

exports.createTask = (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const ownerUsername = req.user.username;
  if (!title) {
    return res.status(400).json({ message: 'O campo title é obrigatório.' });
  }
  if (tasks.find(t => t.ownerUsername === ownerUsername && t.title === title)) {
    return res.status(400).json({ message: 'Já existe uma task com esse título para este usuário.' });
  }
  if (!dueDate || isPast(dueDate)) {
    return res.status(400).json({ message: 'dueDate inválido ou no passado.' });
  }
  const task = {
    id: uuidv4(),
    ownerUsername,
    title,
    description: description || '',
    dueDate,
    priority: priority || 'low',
    status: 'pending',
  };
  tasks.push(task);
  res.status(201).json(task);
};

exports.getTasks = (req, res) => {
  const userTasks = tasks.filter(t => t.ownerUsername === req.user.username);
  res.json(userTasks);
};

exports.getTaskById = (req, res) => {
  const task = tasks.find(t => t.id === req.params.id && t.ownerUsername === req.user.username);
  if (!task) return res.status(404).json({ message: 'Task não encontrada.' });
  res.json(task);
};

exports.updateTask = (req, res) => {
  const task = tasks.find(t => t.id === req.params.id && t.ownerUsername === req.user.username);
  if (!task) return res.status(404).json({ message: 'Task não encontrada.' });
  const { title, description, dueDate, priority, status } = req.body;
  if (title && tasks.find(t => t.ownerUsername === req.user.username && t.title === title && t.id !== task.id)) {
    return res.status(400).json({ message: 'Já existe uma task com esse título para este usuário.' });
  }
  if (dueDate && isPast(dueDate)) {
    return res.status(400).json({ message: 'dueDate inválido ou no passado.' });
  }
  if (title) task.title = title;
  if (description) task.description = description;
  if (dueDate) task.dueDate = dueDate;
  if (priority) task.priority = priority;
  if (status) task.status = status;
  res.json(task);
};

exports.deleteTask = (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id && t.ownerUsername === req.user.username);
  if (idx === -1) return res.status(404).json({ message: 'Task não encontrada.' });
  tasks.splice(idx, 1);
  res.json({ message: 'Task excluída com sucesso.' });
};

exports.completeTask = (req, res) => {
  const task = tasks.find(t => t.id === req.params.id && t.ownerUsername === req.user.username);
  if (!task) return res.status(404).json({ message: 'Task não encontrada.' });
  if (task.status === 'done') {
    return res.status(400).json({ message: 'Task já está concluída.' });
  }
  task.status = 'done';
  res.json({ message: 'Task marcada como concluída.' });
};
