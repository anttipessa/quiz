'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {

    async list(request, response) {
        const games = await Questionnaire.find()
            .sort('_id')
            .exec();
        response.render('management/exercises', { games })
    },

    async show(request, response) {
        console.log('Management View: Show');
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            response.render('management/exercise', { game });
        }
        // If game wasn't found with the given id, redirect back to /questionnaires
        catch (err) {
            console.error(err);
            console.log('Redirecting to /questionnaires');
            return response.redirect('/questionnaires');
        }
    },

    async create(request, response) {
        response.render('management/new')
    },

    async processCreate(request, response) {
        console.log('Management View: Process Create');
    },

    async update(request, response) {
        console.log('Management View: Update');
    },

    async processUpdate(request, response) {
        console.log('Management View: Process Update');
    },

    async delete(request, response) {
        console.log('Management View: Delete');
        const game = await Questionnaire.findById(request.params.id).exec();
        response.render('partials/exercise_delete', {
            game
        });
    },

    async processDelete(request, response) {
        console.log('Management View: Process Delete');
        await Questionnaire.findByIdAndDelete(request.params.id).exec();
        request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect('/questionnaires');
    },
}