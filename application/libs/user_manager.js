
// ========================================
// Module for managing user accounts
// ========================================

var UserModel = require('./user_model');
var logger = require('./logger')(module);
var config = require('../config');
var moment = require('moment');
var jwt = require('jwt-simple');




module.exports = {
    // *****************************************************************************************************************
    // Request token by username and password. On success attaches field token to user object
    // *****************************************************************************************************************
    requestToken  : function (login, password, callback) {
        UserModel.findOne({ login: login, password: password }, function(err, user) {
            if(err) return callback(err, null);
            if(!user) return callback(new Error('User ' + login + ' not found'), null);

            var expires = moment().add(config.token.life.amount, config.token.life.unit).valueOf();

            var token = jwt.encode({
                id: user._id,
                exp: expires
            }, config.token.secret);

            user.token = token;
            callback(null, user);
        });
    },


    // *****************************************************************************************************************
    // Create new user. TODO: Hash password
    // *****************************************************************************************************************
    createUser : function (login, password, callback) {
        var new_user = new UserModel({
            login: login,
            password: password,
            role: 'user'
        });

        new_user.save(function (err) {
            if(err) {
                logger.warn('Failed to create user. Login: ' + login + ' Error: ' + JSON.stringify(err));
            }
            callback(err);
        });
    },



    // *****************************************************************************************************************
    // Find user in database by id
    // *****************************************************************************************************************
    findUserById : function (id, cb) {
        UserModel.findOne({_id: id}, function(err, user) {
            cb(err, user);
        });
    }
};
