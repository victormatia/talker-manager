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

module.exports = route;