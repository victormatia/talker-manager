const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const verify = require('../middlewares/verifications');

const RELATIVE_PATH = '../talker.json';

const route = express.Router();

const createToken = () => crypto.randomBytes(8).toString('hex');

route.get('/talker', verify.Token, async (req, res) => {
  const { q } = req.query;
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, RELATIVE_PATH)));

  if (q) {
    const talkersearchted = talkers.filter((talker) => talker.name.includes(q));

    return res.status(200).json(talkersearchted);
  }

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
    const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, RELATIVE_PATH)));

    const id = talkers.length + 1;
    const newTalker = { id, name, age, talk };
    const newArr = [...talkers, newTalker];

    await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(newArr));

    res.status(201).json(newTalker);
  },
);

route.put(
  '/talker/:id',
  verify.Token,
  verify.Id,
  verify.Name,
  verify.Age,
  verify.Talk,
  verify.Rate,
  verify.Watch,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, RELATIVE_PATH)));
    const filteredById = talkers.filter((talker) => talker.id === Number(id));

    filteredById[0].name = name;
    filteredById[0].age = age;
    filteredById[0].talk = talk;

    await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(talkers));

    res.status(200).json(filteredById[0]);
  },
);

route.delete('/talker/:id', verify.Token, verify.Id, async (req, res) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, RELATIVE_PATH)));
  const filteredById = talkers.filter((talker) => talker.id !== Number(id));

  await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(filteredById));

  res.status(204).end();
});

module.exports = route;