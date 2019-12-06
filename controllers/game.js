'use strict';

const Questionnaire = require('../models/questionnaire');

/*
 * Tänne sisään Controllerin funktiot, joilla ohjataan peliä
 */
module.exports = {

    /* 
     * Nyt toimii GET-request URLiin /games/5dea3a9db6384424cc0f173a
     * joka hakee tuota ID:tä vastaavan pelin MongoDB:stä.
     * 
     * Tästä voi nyt jatkaa kehittämään toimintoja siten, että näytettävä sivu
     * esittää peliä (nyt vain testausmielessä oleva hbs-template) ja muutenkin
     * toimivammaksi funktioksi.
     */
    async showGame(request, response) {
        console.log(request.params.id)
        const games = await Questionnaire.find()
        console.log(games)
        const game = await Questionnaire.findById(request.params.id)
            .exec();

        if (!game) {
            console.log('Error');
            return response.redirect('/');
        }

        response.render('game/game', { game });
    }

};