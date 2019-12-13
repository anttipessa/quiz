'use strict';

module.exports = {
    grade(game, answers, maxPoints) {
        let points = 0;

        // maxPoints must be an integer
        if (!Number.isInteger(maxPoints)) {
            return points;
        }
        // If the user didn't give any answers
        if (answers === undefined) {
            return points;
        }
        // In case of a single answer only, we put it into an array
        else if (!Array.isArray(answers)) {
            answers = [answers];
        }
        // There are no questions in the game
        if (!('questions' in game)) {
            return points;
        }
        /* Jätetään tämäkin versio silmukasta tähän
        game.questions.forEach((question) => {
            for (let i = 0; i < answers.length; i++) {
                let answer = answers[i];
                for (let a = 0; a < question.options.length; a++) {
                    let option = question.options[a].option;
                    let correctness = question.options[a].correctness;
                    if (option == answer) {
                        if (correctness == true) {
                            points++;
                        }
                    }
                }
            }
        });
        */
        let correct = 0;
        let incorrect = 0;

        game.questions.forEach((question) => {
            question.options.forEach((option) => {
                if (answers.includes(option.option)) {
                    if (option.correctness) {
                        correct++;
                    }
                    else {
                        incorrect++;
                    }
                }
            });
        });
        console.log('Correct answers:', correct);
        console.log('Incorrect answers:', incorrect);
        if (incorrect > correct) {
            points = 0;
        }
        else {
            points = correct - incorrect;
        }
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