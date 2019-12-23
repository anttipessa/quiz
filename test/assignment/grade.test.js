/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const grader = require('../../models/gameGrader');

const testgame1 =
{
    'title': 'Multiplication problems',
    'submissions': 1,
    'questions': [
        {
            'title': 'Select the correct multiplications',
            'maxPoints': 2,
            'options': [
                {
                    'option': '25 * 15 = 375',
                    'correctness': true
                },
                {
                    'option': '0 * 0 = 1',
                    'correctness': false
                },
                {
                    'option': '34 * 49 = 1667',
                    'correctness': false
                },
                {
                    'option': '4098 * 38 = 155724',
                    'correctness': false
                },
                {
                    'option': '7 * 4 = 28',
                    'correctness': true
                }
            ]
        }
    ]
};
const testgame2 =
{
    'title': 'Multiplication problems',
    'submissions': 1
};
const testgame3 =
{
    'title': 'Multiplication problems',
    'submissions': 1,
    'questions': [
        {
            'title': 'Select the correct multiplications',
            'options': [
                {
                    'option': '25 * 15 = 375',
                    'correctness': true
                },
                {
                    'option': '0 * 0 = 1',
                    'correctness': false
                },
                {
                    'option': '34 * 49 = 1667',
                    'correctness': false
                },
                {
                    'option': '4098 * 38 = 155724',
                    'correctness': false
                },
                {
                    'option': '7 * 4 = 28',
                    'correctness': true
                }
            ]
        }
    ]
};
const testgame4 =
{
    'title': 'Multiplication problems',
    'submissions': 1,
    'questions': [
        {
            'title': 'Select the correct multiplications',
            'maxPoints': 1,
            'options': [
                {
                    'option': '25 * 15 = 350',
                    'correctness': false
                },
                {
                    'option': '0 * 0 = 1',
                    'correctness': false
                },
                {
                    'option': '34 * 49 = 1667',
                    'correctness': false
                },
                {
                    'option': '4098 * 38 = 155724',
                    'correctness': false
                },
                {
                    'option': '7 * 4 = 28',
                    'correctness': true
                }
            ]
        },
        {
            'title': 'Which number is the largest?',
            'maxPoints': 1,
            'options': [
                {
                    'option': '375',
                    'correctness': false
                },
                {
                    'option': '1',
                    'correctness': false
                },
                {
                    'option': '1667',
                    'correctness': false
                },
                {
                    'option': '155724',
                    'correctness': true
                },
                {
                    'option': '28',
                    'correctness': false
                }
            ]
        }
    ]
};
const emptyAnswer = [[undefined]];

const answers1 = [['25 * 15 = 375', '7 * 4 = 28']];
const answers2 = [['7 * 4 = 28'], ['155724']];
const answers3 = [['34 * 49 = 1667'], ['155724']];
const answers4 = [['34 * 49 = 1667'], ['28']];


describe('/gameGrading', function () {
    it('should grade a game without any answers given', async function () {
        const points = grader.grade(testgame1, emptyAnswer);
        expect(points).to.be.equal(0);
    });
    it('should grade a game without any questions', async function () {
        const points = grader.grade(testgame2, emptyAnswer);
        expect(points).to.be.equal(0);
    });
    it('should get maxpoints from a game without any questions', async function () {
        const maxpoints = grader.maxPoints(testgame2);
        expect(maxpoints).to.be.equal(0);
    });
    it('should grade without maxpoints', async function () {
        const maxpoints = grader.maxPoints(testgame3);
        expect(maxpoints).to.be.equal(0);
    });
    it('should grade correctly a game with only 1 question', async function () {
        const points = grader.grade(testgame1, answers1);
        expect(points).to.be.equal(2);
    });
    it('should grade correctly within multi-question games', async function () {
        const points = grader.grade(testgame4, answers2);
        expect(points).to.be.equal(2);
    });
    it('should return correct points when some of the answers are wrong and some right', async function () {
        const points = grader.grade(testgame4, answers3);
        expect(points).to.be.equal(1);
    });
    it('shoulde return 0 when all given answers were false', async function () {
        const points = grader.grade(testgame4, answers4);
        expect(points).to.be.equal(0);
    });

});
