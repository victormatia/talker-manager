const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const verify = require('../middlewares/verifications');

const route = express.Router();

const createToken = () => crypto.randomBytes(8).toString('hex');

route.get('/talker', async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));
  res.status(200).json(talkers);
});

route.get('/talker/:id', verify.Id, async (req, res) => {
  res.status(200).json(req.talker);
});

route.post('/login', verify.Email, verify.Pass, (req, res) => {
  res.status(200).json({ token: createToken() });
});

route.post(
  '/talker',
  verify.Token,
  verify.Name,
  verify.Age,
  verify.Talk,
  verify.Rate,
  verify.Watch,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));

    const id = talkers.length + 1;
    const newTalker = { id, name, age, talk };
    const newobj = [...talkers, newTalker];

    await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(newobj));

    res.status(201).json(newTalker);
  },
);

module.exports = route;