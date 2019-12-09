'use strict';

const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/game');

router.get('/', GamesController.listGames);

router
  .route('/:id')
  .get(GamesController.launchGame)
  .post(GamesController.gradeGame);

module.exports = router;