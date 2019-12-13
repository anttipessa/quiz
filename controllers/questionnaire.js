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
    },

    async create(request, response) {
        console.log('Management View: Create');
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
    },

    async processDelete(request, response) {
        console.log('Management View: Process Delete');
    },
}