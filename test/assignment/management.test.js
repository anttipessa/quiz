/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const config = require('config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app.js');
const admin = config.get('admin');
const User = require('../../models/user');
const Questionnaire = require('../../models/questionnaire');
const createGame = require('../../setup/createdata');

const loginUrl = '/users/login';
const mview = '/questionnaires';
const games = '/games';
const createtest = '/questionnaires/new';


describe('Game: A+ protocol', function() {
    let request;

    beforeEach(async function() {
        try {
            // remove all users from the database and re-create admin user
            await User.deleteMany({});
            createGame();
            const userData = { ...admin, role: 'admin' };
            const user = new User(userData);
            await user.save();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            throw err;
        }
    });
    describe('Management view', function() {

        let payload;
        let editload;
        let newload;

        beforeEach(function() {
            request = chai.request.agent(app);
            // create a new copy of admin for each test
            payload = { ...admin };
            editload = {
                title: 'Changing the title here',
                option: 'Newoption'
            };
            newload = {
                title: 'New game title',
                maxSubmissions: 1,
                questionTitle: 'Question 1',
                maxPoints: 1,
                option1: 'Correct',
                correctness1: 'true',
                option2: 'Incorrect',
                correctness2: 'false'
            };
            delete payload.name;
            delete payload.role;
        });

        afterEach(function() {
            request.close();
        });


        it('should allow admin access to management view', async function() {
            await request
                .post(loginUrl)
                .type('form')
                .send(payload);
            const response = await request
                .get(mview);
            expect(response).to.have.status(200);
        });

        it('should not allow unauthenticated user access to management view', async function() {
            const response = await request
                .get(mview);
            expect(response).to.redirectTo(/\/users\/login$/);
        });

        describe('Create', function() {
            it('should allow admin access to creating a new game', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const response = await request
                    .get(createtest);
                expect(response).to.have.status(200);
            });

            it('should allow admin to create a new game', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const response = await request
                    .post(createtest)
                    .type('form')
                    .send(newload);
                expect(response).to.have.status(200);
            });

            it('should now allow unauthenticated user to create a new game', async function() {
                const response = await request
                    .post(createtest)
                    .type('form')
                    .send(newload);
                expect(response).to.redirectTo(/\/users\/login$/);
            });
        });

        describe('Read', function() {
            it('should allow admin to view a game in management view', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const game = await Questionnaire.findOne();
                const response = await request
                    .get(`/questionnaires/${game._id}`);
                expect(response).to.have.status(200);
            });

            it('should not allow unauthenticated user to view a game in management view', async function() {
                const game = await Questionnaire.findOne();
                const response = await request
                    .get(`/questionnaires/${game._id}`);
                expect(response).to.redirectTo(/\/users\/login$/);
            });
        });

        describe('Update', function() {
            it('should allow admin to edit a game in management view', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const game = await Questionnaire.findOne();
                console.log(game._id);
                const response = await request
                    .post(`/questionnaires/edit/${game._id}`)
                    .type('form')
                    .send(editload);
                expect(response).to.have.status(200);
            });
        });


        describe('Delete', function() {
            it('should not allow unauthenticated user access to game deletion view', async function() {
                const game = await Questionnaire.findOne();
                const response = await request
                    .get(`/questionnaires/delete/${game._id}`);
                expect(response).to.redirectTo(/\/users\/login$/);


            });

            it('should not allow unauthenticated user to delete a game in management view', async function() {
                const game = await Questionnaire.findOne();
                const response = await request
                    .get(`/questionnaires/delete/${game._id}`);
                expect(response).to.redirectTo(/\/users\/login$/);
            });

            it('should allow admin to access to game deletion in management view', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const game = await Questionnaire.findOne();
                const response = await request
                    .get(`/questionnaires/delete/${game._id}`);
                expect(response).to.have.status(200);
            });

            it('should allow admin to delete a game', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const game = await Questionnaire.findOne();
                console.log(game.title);
                const response = await request
                    .post(`/questionnaires/delete/${game._id}`);
                expect(response).to.have.status(200);
                console.log(await Questionnaire.find());
            });
        });
        describe('Games', function() {
            it('should not allow unauthenticated user access to games', async function() {
                const response = await request
                    .get(games);
                expect(response).to.redirectTo(/\/users\/login$/);
            });

            it('should allow authenticated user access to games', async function() {
                await request
                    .post(loginUrl)
                    .type('form')
                    .send(payload);
                const response = await request
                    .get(games);
                expect(response).to.have.status(200);
            });
        });
    });
});
