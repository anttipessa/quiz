'use strict';

module.exports = {
    grade(game, answers) {
        let points = 0;

        // There are no questions in the game
        if (!('questions' in game)) {
            return points;
        }
        let idx = 0;
        game.questions.forEach((question) => {
            question.options.forEach((option) => {
                if (answers[idx].includes(option.option)) {
                    if (option.correctness) {
                        points++;
                    }
                }
            });
            idx++;
        });
        return points;
    },

    maxPoints(game) {
        let maxPoints = 0;

        // There are no questions in the game
        if (!('questions' in game)) {
            return points;
        }
        game.questions.forEach((question) => {
            maxPoints += question.maxPoints;
        });

        return maxPoints;
    }
}