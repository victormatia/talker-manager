const fs = require('fs/promises');
const path = require('path');

const Id = async (req, res, next) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));
  const talker = talkers.find((e) => e.id === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  req.talker = talker;
  next();
};

const Email = (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  const emailRegex = /\S+@\S+\.\S+/;
  const isValidEmail = emailRegex.test(email);

  if (!isValidEmail) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const Pass = (req, res, next) => {
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });

  const minimalLenth = 6;

  if (password.length < minimalLenth) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

module.exports = {
  Email,
  Id,
  Pass,
};