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
    /*
     * grades the game
     */
    async gradeGame(request, response) {       
        //retrieves what user answered
        var vastaukset=request.body.check;
        //because user migh not have clicked any checkboxes we check it
        if(vastaukset=='undefined'){
            vastaukset=[];
        }
        //because only one answer returns string instead of array we force it to an array
        else if(typeof vastaukset == "string"){
            vastaukset=[vastaukset];
        }
        else{

        }

        console.log(vastaukset);
        //parse game id from url
        var tid=request.url;
        var id="";
        for(var i=1;i<tid.length;i++){
            id+=tid.charAt(i);
        }
        console.log(id);
        try{
            //set score to 1
            var pisteet=0;
            //retrieve game by id
            const tiedot = await Questionnaire.findById(id).exec();
            //retrieves the options to the questions
            var ehdot=tiedot.questions[0].options;
            console.log(ehdot);
            console.log(ehdot.length);
            //loops the options one answer at a time and when it finds the answers value from
            //option list it checks it correctness and raises the score if the value is true.
            for(var i=0;i<vastaukset.length;i++){
                var vastaus=vastaukset[i];
                for(var a=0;a<ehdot.length;a++){
                    var ehto=ehdot[a].option;
                    var oikeus=ehdot[a].correctness;
                    console.log(ehto + " " + oikeus);
                    if(ehto==vastaus){
                        if(oikeus==true){
                            pisteet++;
                        }
                    }
                }
            }
            //TODO: Render the result page
            console.log(pisteet);
        }
        catch(err){
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