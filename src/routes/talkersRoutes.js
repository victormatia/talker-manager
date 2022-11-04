const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const route = express.Router();

route.get('/', async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(path.resolve(__dirname, '../talker.json')));
  res.status(200).send(talkers);
});

module.exports = route;