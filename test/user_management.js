
// *************************************************************
// Testing user_manager.js unit
// *************************************************************

var config = require('./../application/config');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
const should = chai.should;
const userManager = require('../application/libs/user_manager');




// **********************************
//              TESTS
// **********************************


describe('User management', function () {

    describe('getUsers', function () {
        it('defined', function () {
            // expect(userManager.getUsers).to.exist;
        });
    });





    describe('createUser', function () {
        it('defined', function () {
            expect(userManager.createUser).to.exist;
        });
    });




    // TODO Странная хрень тут твориться, комрады. Отдельно этот тест проходит, но вместе с остальными фейлит before
    //      мб где контекст теряется конечно, хзхз
    describe('removeUser', function () {
        before('create test user for removal', function (done) {
            userManager.createUser('test_r', 'test', 'user', function (err) {
                done(err);
            });
        });

        after('remove test user fo token request', function (done) {
            userManager.removeUser('test_r', function (err) {
                done();
            });
        });

        it('defined', function (done) {
            expect(userManager.removeUser).to.exist;
            done();
        });

        it('removal of existing user', function (done) {
            userManager.removeUser('test_r', function (err) {
                expect(err).to.be.null;
                done();
            });
        });
    });





    describe('editUser', function () {
        it('defined', function () {
            // expect(userManager.editUser).to.exist;
        });
    });




    describe('requestToken', function () {
        /*
        before('create test user for token request', function (done) {
            userManager.createUser('test', 'test', 'user', function (err) {
                if(err) {
                    throw err;
                }
                else {
                    done();
                }
            });
        });

        after('remove test user for token request', function (done) {
            userManager.removeUser('test', function (err) {
                if(!err) {
                    done();
                }
                else {
                    throw err;
                }
            });
        });

        it('defined', function () {
            expect(userManager.requestToken).to.exist;
        });

        it('request token', function (done) {
            userManager.requestToken('test', 'test', function (err, user) {
                expect(err).to.be.null;
                expect(user).to.exist;
                expect(user.token).to.exist;

                done();
            });
        });
        */
    });
});
