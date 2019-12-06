'use strict';

const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/game');

router.get('/'); // tähän vielä GamesControllerista funktio, mitä tehdään

router
  .route('/:id')
  .get(GamesController.showGame)
  .post(); // tänne vielä GamesControllerista funktio, mitä tapahtuu POST-metodissa

module.exports = router;