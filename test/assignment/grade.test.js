/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app');
const grader = require('../../models/gameGrader');

const testgame1 =
    [{
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
    }];
const testgame2 =
    [{
        'title': 'Multiplication problems',
        'submissions': 1
    }];
const testgame3 =
    [{
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
    }];
const emptyAnswer = [];


describe('/gameGrading', function() {
    it('should grade without answers', async function() {
        const points = grader.grade(testgame1, emptyAnswer);
        expect(points).to.be.equal(0);
    });
    it('should grade a game without questions', async function() {
        const points = grader.grade(testgame2, emptyAnswer);
        expect(points).to.be.equal(0);
    });
    it('should get maxpoints with no questions', async function() {
        const maxpoints = grader.maxPoints(testgame2);
        expect(maxpoints).to.be.equal(0);
    });
    it('should grade without maxpoints', async function() {
        const maxpoints = grader.maxPoints(testgame3);
        expect(maxpoints).to.be.equal(0);
    });

});
