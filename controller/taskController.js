// controller/taskController.js
const taskService = require('../service/taskService');

exports.createTask = taskService.createTask;
exports.getTasks = taskService.getTasks;
exports.getTaskById = taskService.getTaskById;
exports.updateTask = taskService.updateTask;
exports.deleteTask = taskService.deleteTask;
exports.completeTask = taskService.completeTask;
