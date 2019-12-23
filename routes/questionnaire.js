'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: false });

const router = express.Router();
const QuestionnaireController = require('../controllers/questionnaire');

router.use(auth.ensureTeacher);

// View documents
router.get('/', csrfProtection, QuestionnaireController.list);
router.get('/:id([a-f0-9]{24})', QuestionnaireController.show);

// Create documents
router.get('/new', QuestionnaireController.create);
router.post('/new', QuestionnaireController.processCreate);

// Update documents
router.route('/edit/:id').all(auth.ensureTeacher, csrfProtection);
router.get('/edit/:id', QuestionnaireController.update);
router.post('/edit/:id', QuestionnaireController.processUpdate);

// Delete documents
router.route('/delete/:id').all(auth.ensureTeacher, csrfProtection);
router.get('/delete/:id', QuestionnaireController.delete);
router.post('/delete/:id', QuestionnaireController.processDelete);

router.all('/:id', QuestionnaireController.show);


module.exports = router;
