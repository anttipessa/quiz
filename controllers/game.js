'use strict';

const Questionnaire = require('../models/questionnaire');

/*
 * Tänne sisään Controllerin funktiot, joilla ohjataan peliä
 */
module.exports = {

    /* 
     * Nyt toimii GET-request URLiin /games/id
     * joka hakee tuota id:tä vastaavan pelin MongoDB:stä.
     * 
     * Tästä voi nyt jatkaa kehittämään toimintoja siten, että näytettävä sivu
     * esittää peliä (nyt vain testausmielessä oleva hbs-template) ja muutenkin
     * toimivammaksi funktioksi.
     */
    async showGame(request, response) {
        console.log(request.params.id)
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();

            response.render('game/game', { game });
        }
        catch (err) {
            console.error(err);
            console.log('Redirecting to /games');
            return response.redirect('/games');
        }
    },

    /*
     * Listaa kaikki tietokannasta löytyvät pelit näkyväksi sivulle.
     */
    async listGames(request, response) {
        const games = await Questionnaire.find()
            .sort('title')
            .exec();
        response.render('game/games', { games })
    }

};