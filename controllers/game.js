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
            response.render('game/game', { game });
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
        // Retrieves what user answered (might be undefined if no checkboxes were selected)
        // and that kind of error will be catched (for now)
        let answers = request.body.check;

        // TODO: Still problem with grading, because answers for questions aren't separated
        // and if two questions have same option and they are choosed twice, total points
        // counter increases by 2 instead of 1 and it messes the grading.
        try {
            // Retrieve game by id (retrieved from URL)
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            // Get total max points for all questions in questionnaire
            const maxPoints = Grader.maxPoints(game);
            console.log('Max points:', maxPoints);
            // Loops the options one answer at a time and when it finds the answers value from
            // option list it checks it correctness and raises the score if the value is true.
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
            .sort('title')
            .exec();
        response.render('game/games', { games })
    }

};