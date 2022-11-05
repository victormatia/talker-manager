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

const Token = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length < 16 || typeof authorization !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const Name = (req, res, next) => {
  if (!('name' in req.body)) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  
  const { name } = req.body;

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const Age = (req, res, next) => {
  if (!('age' in req.body)) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  
  const { age } = req.body;

  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const Rate = ({ body: { talk } }, res, next) => {
  if (!('rate' in talk)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if ((talk.rate < 0 || talk.rate > 5) || !Number.isInteger(talk.rate)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

const Watch = ({ body: { talk } }, res, next) => {
  if (!('watchedAt' in talk)) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  const isValideDate = regexDate.test(talk.watchedAt);

  if (!isValideDate) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const Talk = (req, res, next) => {
  if (!('talk' in req.body)) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  next();
};

module.exports = {
  Email,
  Id,
  Pass,
  Token,
  Name,
  Age,
  Talk,
  Rate,
  Watch,
};