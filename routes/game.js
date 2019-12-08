'use strict';

const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/game');

router.get('/', GamesController.listGames);

router
  .route('/:id')
  .get(GamesController.launchGame)
  .post(); // tänne vielä GamesControllerista funktio, mitä tapahtuu POST-metodissa

module.exports = router;