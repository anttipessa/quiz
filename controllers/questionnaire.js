'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {

    async list(request, response) {
        const games = await Questionnaire.find()
            .sort('_id')
            .exec();
        response.render('management/exercises', { games });
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
        response.render('management/new');
    },

    async processCreate(request, response) {
        console.log('Management View: Process Create');
        console.log(request.body)
        response.redirect('/questionnaires')
    },

    async update(request, response) {
        console.log('Management View: Update');
        const game = await Questionnaire.findById(request.params.id).exec();
        response.render('management/exercise_edit', {
            game,
            csrfToken: request.csrfToken()
        });
    },

    async processUpdate(request, response) {
        console.log('Management View: Process Update');
        // todo csrf token, error handling, validation?
        const { option, title } = request.body;
        const correctnessList = [];
        for (const key in request.body) {
            // Save true / false options to a list
            if (key !== 'option' && key !== '_csrf' && key !== 'title') {
                correctnessList.push(request.body[key]);
            }
        }
        const game = await Questionnaire.findById(request.params.id).exec();

        let errorMsg = 'Failed to update quiz information';
        try {
            let i = 0;
            let j = 0;
            game.questions.forEach((question) => {
                question.title = title[j];
                question.options.forEach((opt) => {
                    opt.option = option[i];
                    opt.correctness = correctnessList[i];
                    i++;
                });
                let trueCounter = 0;
                // We wanna check that a single question doesn't have more than
                // one correct option checked.
                question.options.forEach((opt) => {
                    if (opt.correctness) {
                        trueCounter += 1;
                        if (trueCounter > 1) {
                            errorMsg = 'Question can have only 1 correct option'
                            throw new Error();
                        }
                    }
                });
                j++;
            });
            await game.save();

            request.flash(
                'successMessage',
                'The information of this quiz was updated successfully.'
            );
        }
        // If validation errors happen
        catch (err) {
            request.flash(
                'errorMessage',
                errorMsg
            );
        }
        response.redirect('/questionnaires');
    },

    async delete(request, response) {
        console.log('Management View: Delete');
        const game = await Questionnaire.findById(request.params.id).exec();

        if (!game) {
            request.flash(
                'errorMessage',
                `Game not found (id: ${request.params.id})`
            );
            return response.redirect('/questionnaires');
        }

        response.render('partials/exercise_delete', {
            game,
            csrfToken: request.csrfToken()
        });
    },

    async processDelete(request, response) {
        console.log('Management View: Process Delete');
        await Questionnaire.findByIdAndDelete(request.params.id).exec();
        request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect('/questionnaires');
    }
};
