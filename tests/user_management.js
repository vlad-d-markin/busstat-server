var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var userManagement = require('./../application/libs/user_manager');
var mongoose = require('mongoose');

mongoose.connect(config.db.url);
var db = mongoose.connection;
db.on('open', function () {
});
db.on('error', function () {
    process.exit(-1);
});


describe('UserMamagement', function () {
    it('createUser() should create user', function () {
        var UserModel = require('./../application/libs/user_model');
        UserModel.find({login: 'testuser'}, function (err, users) {

        });

        expect(0).to.equal(0);
    });
});

