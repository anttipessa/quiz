'use strict';

module.exports = {
    /**
     * Prints exercise page
     * @param {Object} request is express request object
     * @param {Object} response is express response object
     */
    showExercise(request, response) {
        // currently we use only the default exercise here
        response.render('home');
    },
};
