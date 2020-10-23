'use strict';

const express = require('express');
const router = express.Router();
const HelloController = require('../controllers/hello');

router.get('/hello', HelloController.showExercise);
router.post('/hello', HelloController.gradeExercise);

module.exports = router;
