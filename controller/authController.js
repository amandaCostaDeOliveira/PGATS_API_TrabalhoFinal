// controller/authController.js
const authService = require('../service/authService');

exports.register = authService.register;
exports.login = authService.login;
