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

        beforeEach(function() {
            request = chai.request.agent(app);
            // create a new copy of admin for each test
            payload = { ...admin };
            delete payload.name;
            delete payload.role;

            // admin is logged in before every test
            request
                .post(loginUrl)
                .type('form')
                .send(payload);
        });

        afterEach(function() {
            request.close();
        });

        it('It should allow admin user to access /questionnaires', async function() {
            const response = await request
                .post(mview);
        });


        it('C: create operation available');


        it('R: read operation available');

        it('U: update operation available');

        it('D: delete operation available');
    });
});
