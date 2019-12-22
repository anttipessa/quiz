/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const config = require('config');
const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app.js');
const admin = config.get('admin');
const User = require('../../models/user');

const loginUrl = '/users/login';
const mview = '/questionnaires';
const games = '/games';
const testid = '/questionnaires/5dffbfc3e435d617c7419acf';
const edittest = '/questionnaires/edit/5dffbb52da97f3170768e853';

describe('Game: A+ protocol', function() {
    let request;


    beforeEach(async function() {
        try {
            // remove all users from the database and re-create admin user
            await User.deleteMany({});

            const userData = { ...admin, role: 'admin' };
            const user = new User(userData);
            await user.save();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            throw err;
        }
    });
    describe('/questionnaires', function() {

        let payload;
        let editload;

        beforeEach(function() {
            request = chai.request.agent(app);
            // create a new copy of admin for each test
            payload = { ...admin };
            editload = {
                title: 'Changing the title here',
                option: 'Newoption'
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

        // how to get a questionnaire id? to test show/edit/delete? 
        it('should allow admin to view a game in management view', async function() {
            await request
                .post(loginUrl)
                .type('form')
                .send(payload);
            const response = await request
                .get(testid);
            expect(response).to.have.status(200);
        });

        it('should not allow unauthenticated user to view a game in management view', async function() {
            const response = await request
                .get(testid);
            expect(response).to.redirectTo(/\/users\/login$/);
        });

        it('should allow admin to edit a game in management view', async function() {
            await request
                .post(loginUrl)
                .type('form')
                .send(payload);
            const response = await request
                .post(edittest)
                .type('form')
                .send(editload);
            expect(response).to.redirectTo(mview);
        });

        it('C: create operation available');


        it('R: read operation available');

        it('U: update operation available');

        it('D: delete operation available');
    });
});
