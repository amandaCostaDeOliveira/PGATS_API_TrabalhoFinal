// service/authService.js
const users = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'supersecret'; // Em produção, use variável de ambiente

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password são obrigatórios.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }
  const hashed = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashed });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password são obrigatórios.' });
  }
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.SECRET = SECRET;
