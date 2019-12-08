'use strict';

const Questionnaire = require('../models/questionnaire');

/*
 * Tänne sisään Controllerin funktiot, joilla ohjataan peliä
 */
module.exports = {

    /** 
     * Returns a game with specific id.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     * 
     * GET-request URLiin /games/id hakee tuota id:tä vastaavan pelin MongoDB:stä.
     * 
     * Tästä voi nyt jatkaa kehittämään toimintoja siten, että näytettävä sivu
     * esittää peliä (nyt vain testausmielessä oleva hbs-template) ja muutenkin
     * toimivammaksi funktioksi.
     */
    async launchGame(request, response) {
        console.log(request.params.id);
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            console.log(game);
            console.log(game.questions);
            response.render('game/game', { game });
        }
        // If game wasn't found with the given id, redirect back to /games
        catch (err) {
            console.error(err);
            console.log('Redirecting to /games');
            return response.redirect('/games');
        }
    },

    /**
     * Returns list of games from Mongo database.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async listGames(request, response) {
        const games = await Questionnaire.find()
            .sort('title')
            .exec();
        response.render('game/games', { games })
    }

};