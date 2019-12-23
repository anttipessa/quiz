'use strict';

const Questionnaire = require('../models/questionnaire');
const Grader = require('../models/gameGrader');

/*
 * Tänne sisään Controllerin funktiot, joilla ohjataan peliä
 */
module.exports = {

    /**
     * Get game data, which is needed in quiz game and we don't need to 
     * pass game variable through handlebars so that the data would be visible
     * in page source.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async getData(request, response) {
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            response.set('Content-Type', 'application/json');
            response.end(JSON.stringify(game));
        } catch (err) {
            request.flash(
                'errorMessage',
                'No game was found with the given id.'
            );
            return response.redirect('/games');
        }
    },

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
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            const rendered = {
                game: JSON.stringify(game)
            };
            response.render('game/game', rendered);
        } catch (err) {
            request.flash(
                'errorMessage',
                `No game was found with id: ${request.params.id}`
            );
            return response.redirect('/games');
        }
    },
    /**
     * Grades the game.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async gradeGame(request, response) {
        // Retrieves what user answered (selected radio buttons)
        const answers = [];
        // Answers from different questions are put into their own arrays
        for (const key in request.body) {
            answers.push([request.body[key]]);
        }

        try {
            // Retrieve game by id (retrieved from URL)
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            // Get total max points for all questions in questionnaire
            const maxPoints = Grader.maxPoints(game);
            // Get users score from the questionnaire
            const points = Grader.grade(game, answers, maxPoints);

            response.render('game/game-graded', {
                points: points,
                maxPoints: maxPoints,
                status: 'graded',
                description: 'Some description here',
                title: 'Points awarded'
            });

        } catch (err) {
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
            .sort('_id')
            .exec();
        response.render('game/games', { games });
    }

};
