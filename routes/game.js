'use strict';

const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/game');
const auth = require('../middleware/auth');


router.use(auth.ensureAuthenticated);

router.get('/', GamesController.listGames);

router.get('/data/:id', GamesController.getData);

router
    .route('/:id')
    .get(GamesController.launchGame)
    .post(GamesController.gradeGame);

module.exports = router;
