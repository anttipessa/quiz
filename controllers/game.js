'use strict';

const Questionnaire = require('../models/questionnaire');
const Grader = require('../models/gameGrader');

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
            let rendered = {
                game: JSON.stringify(game)
            }
            response.render('game/game', rendered);
        }
        // If game wasn't found with the given id, redirect back to /games
        catch (err) {
            console.error(err);
            console.log('Redirecting to /games');
            request.flash(
                'errorMessage',
                'No game was found with the given id.'
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
        let answers = [];
        // Answers from different questions are put into their own arrays
        for (let key in request.body) {
            answers.push([request.body[key]])
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
        }
        catch (err) {
            console.error(err);
            console.log('An error occured! Redirecting to /games');
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
        response.render('game/games', { games })
    }

};