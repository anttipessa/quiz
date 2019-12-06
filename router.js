'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const GamesRouter = require('./routes/game') // Otetaan oma router käyttöön

// Setup Routes
module.exports = function (app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/games', GamesRouter) // URL:issa /games käytetään omaa Routeria
};
