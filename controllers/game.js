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
     * Grades the game.
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    async gradeGame(request, response) {
        // Retrieves what user answered (might be undefined if no checkboxes were selected)
        // and that kind of error will be catched (for now)
        let answers = request.body.check;

        // TODO: Better error handling in case of user trying to grade without choosing
        // any options.
        // TODO: Also, if the questionnaire contains more than 1 question, we need a loop
        // to go through all questions and their correct answers and maxpoints.
        // TODO: Also it could be useful to implement a grader model (see models/hello.js)
        // where the actual grading happens so we can clean this function a lot.
        try {
            // Set initial score to 0
            let points = 0;
            // Retrieve game by id (retrieved from URL)
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            // Retrieves the options to the questions
            let gameOptions = game.questions[0].options;
            const maxPoints = game.questions[0].maxPoints;
            console.log(gameOptions);
            console.log(gameOptions.length);
            // Loops the options one answer at a time and when it finds the answers value from
            // option list it checks it correctness and raises the score if the value is true.
            for (let i = 0; i < answers.length; i++) {
                let answer = answers[i];
                for (let a = 0; a < gameOptions.length; a++) {
                    let option = gameOptions[a].option;
                    let correctness = gameOptions[a].correctness;
                    console.log(option + " " + correctness);
                    if (option == answer) {
                        if (correctness == true) {
                            points++;
                        }
                    }
                }
            }
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