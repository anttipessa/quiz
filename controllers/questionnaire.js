'use strict';

const Questionnaire = require('../models/questionnaire');
const redirectUrl = '/questionnaires';

module.exports = {

    async list(request, response) {
        const games = await Questionnaire.find()
            .sort('_id')
            .exec();
        response.render('management/exercises', { games });
    },

    async show(request, response) {
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            response.render('management/exercise', { game });
        } catch (err) {
            request.flash(
                'errorMessage',
                `No game was found with id: ${request.params.id}`
            );
            return response.redirect(redirectUrl);
        }
    },

    async create(request, response) {
        response.render('management/new');
    },

    async processCreate(request, response) {
        const { title, maxSubmissions } = request.body;
        let { questionTitle, maxPoints } = request.body;
        let questionnaire = await Questionnaire.findOne({ title }).exec();

        if (questionnaire) {
            request.flash(
                'errorMessage',
                'Found existing exercise with the given title.'
            );
            return response.redirect(redirectUrl);
        }

        // If there is only one question, put the title and maxPoints inside an array
        if (!Array.isArray(questionTitle)) {
            questionTitle = [questionTitle];
        }
        if (!Array.isArray(maxPoints)) {
            maxPoints = [maxPoints];
        }

        questionnaire = new Questionnaire();
        questionnaire.title = request.sanitize(title);
        questionnaire.submissions = request.sanitize(maxSubmissions);
        questionnaire.questions = [];

        const options = [];

        for (const key in request.body) {
            if (key !== 'title' && key !== 'maxSubmissions' &&
                key !== 'questionTitle' && key !== 'maxPoints') {
                // Push option values and correctness-informations as array,
                // if only 1 value was given, make it an array
                if (!Array.isArray(request.body[key])) {
                    options.push([request.body[key]]);
                } else {
                    options.push(request.body[key]);
                }
            }
        }

        let m = 0;
        for (let i = 0; i < questionTitle.length; i++) {
            const question = {
                title: request.sanitize(questionTitle[i]),
                maxPoints: request.sanitize(maxPoints[i]),
                options: []
            };
            for (let j = 0; j < options[m].length; j++) {
                const option = {
                    option: request.sanitize(options[m][j]),
                    correctness: request.sanitize(options[m + 1][j])
                };
                question.options.push(option);
            }
            questionnaire.questions.push(question);
            m += 2;
        }

        let errorMsg = 'Could not create a new exercise with the given values.';
        try {
            questionnaire.questions.forEach((question) => {
                if (question.options.length > 5) {
                    errorMsg = 'Could not create a new exercise: \
                    Maximum of five (5) different options can be added to single question.';
                    throw new Error();
                }
                let trueCounter = 0;
                // We wanna check that a single question doesn't have more than
                // one correct option checked.
                question.options.forEach((opt) => {
                    if (opt.correctness) {
                        trueCounter += 1;
                        if (trueCounter > 1) {
                            errorMsg = 'Could not create a new exercise: a question can have only 1 correct option';
                            throw new Error();
                        }
                    }
                });
                if (trueCounter === 0) {
                    errorMsg = 'Could not create a new exercise: All questions must have 1 correct option.';
                }
            });
            await questionnaire.save();
            request.flash(
                'successMessage',
                `Exercise "${questionnaire.title}" created succesfully.`
            );
        } catch (err) {
            request.flash(
                'errorMessage',
                errorMsg
            );
        }
        response.redirect(redirectUrl);

    },

    async update(request, response) {
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            response.render('management/edit', {
                game,
                csrfToken: request.csrfToken()
            });
        } catch (err) {
            request.flash(
                'errorMessage',
                `No game was found with id: ${request.params.id}`
            );
            return response.redirect(redirectUrl);
        }
    },

    async processUpdate(request, response) {
        const { option } = request.body;
        let { title } = request.body;
        const correctnessList = [];
        if (!Array.isArray(title)) {
            title = [title];
        }
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
                question.title = request.sanitize(title[j]);
                question.options.forEach((opt) => {
                    opt.option = request.sanitize(option[i]);
                    opt.correctness = request.sanitize(correctnessList[i]);
                    i++;
                });
                let trueCounter = 0;
                // We wanna check that a single question doesn't have more than
                // one correct option checked.
                question.options.forEach((opt) => {
                    if (opt.correctness) {
                        trueCounter += 1;
                        if (trueCounter > 1) {
                            errorMsg = 'Failed to update quiz information: a question can have only 1 correct option.';
                            throw new Error();
                        }
                    }
                });
                if (trueCounter === 0) {
                    errorMsg = 'Failed to update quiz information: All questions must have 1 correct option.';
                    throw new Error();
                }
                j++;
            });
            await game.save();

            request.flash(
                'successMessage',
                'The information of this quiz was updated successfully.'
            );
        } catch (err) {
            request.flash(
                'errorMessage',
                errorMsg
            );
        }
        response.redirect(redirectUrl);
    },

    async delete(request, response) {
        try {
            const game = await Questionnaire.findById(request.params.id)
                .exec();
            response.render('management/delete', {
                game,
                csrfToken: request.csrfToken()
            });
        } catch (err) {
            request.flash(
                'errorMessage',
                `No game was found with id: ${request.params.id}`
            );
            return response.redirect(redirectUrl);
        }

    },

    async processDelete(request, response) {
        await Questionnaire.findByIdAndDelete(request.params.id).exec();
        request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect(redirectUrl);
    }
};
