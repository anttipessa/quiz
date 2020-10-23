'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const GamesRouter = require('./routes/game');
const HomeRouter = require('./routes/home');
const QuestionnaireRouter = require('./routes/questionnaire');

// Setup Routes
module.exports = function (app) {
    app.use('/', HomeRouter);
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/games', GamesRouter);
    app.use('/questionnaires', QuestionnaireRouter);
};
