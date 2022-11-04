const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const route = express.Router();

const verifyId = async (req, res, next) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));
  const talker = talkers.find((e) => e.id === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  req.talker = talker;
  next();
};

// const verifyEmail = (req, res) => {
//   const
//   if
// };

const createToken = () => crypto.randomBytes(8).toString('hex');

route.get('/talker', async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));
  res.status(200).json(talkers);
});

route.get('/talker/:id', verifyId, async (req, res) => {
  res.status(200).json(req.talker);
});

route.post('/login', (req, res) => {
  res.status(200).json({ token: createToken() });
});

module.exports = route;