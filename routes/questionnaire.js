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
router.route('/edit/:id')
    .get(QuestionnaireController.update)
    .post(QuestionnaireController.processUpdate);

// Delete documents
router
    .route('/delete/:id')
    .get(QuestionnaireController.delete)
    .post(QuestionnaireController.processDelete);

router.all('/:id', QuestionnaireController.show);


module.exports = router;
