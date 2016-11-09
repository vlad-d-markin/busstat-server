
// ========================================
// Module for managing user accounts
// ========================================

var UserModel = require('./../models/user_model');
var logger = require('./logger')(module);
var config = require('../config');
var moment = require('moment');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');




module.exports = {
    // *****************************************************************************************************************
    // Create new user.
    // *****************************************************************************************************************
    createUser : function (login, password, role, callback) {
        if(!login) {
            return(callback(new Error('Login not defined')));
        }
        if(!password) {
            return(callback(new Error('Password not defined')));
        }
        if(!role) {
            role = 'user';
        }

        // Store hash in your password DB.
        bcrypt.hash(password, config.hash.saltRound, function(err, hash) {
            if (err){
                return callback(err);
            }
            var new_user = new UserModel({
                login: login,
                password: hash,
                role: role
            });
            new_user.save(function (err) {
                if(err) {
                    return callback(err);
                }
                else {
                    return callback(null);
                }
            });
        });
    },


    removeUser : function (login, callback) {
        UserModel.findOneAndRemove({login : login}, callback);
    },


    // *****************************************************************************************************************
    // Request token by username and password. On success attaches field token to user object
    // *****************************************************************************************************************
    requestToken  : function (login, password, callback) {
        if(!login) {
            return callback(new Error('Login not defined'), null);
        }
        if(!password) {
            return callback(new Error('Password not defined'), null);
        }

        UserModel.findOne({ login: login }, function(err, user) {
            if(err) {
                return callback(err, null);
            }
            if(!user) {
                return callback(new Error('User ' + login + ' not found'), null);
            }
            // password comparison
            bcrypt.compare(password, user.password, function(err, res) {
                if(err) {
                    return callback(err);
                }
                if(!res) {
                    return callback(new Error('Incorrect password'), null);
                }

                var expires = moment().add(config.token.life.amount, config.token.life.unit).valueOf();
                var token = jwt.encode({
                    id: user._id,
                    exp: expires
                }, config.token.secret);

                user.token = token;
                callback(null, user);
            });
        });
    },


    // *****************************************************************************************************************
    // Gives all users with their roles
    // *****************************************************************************************************************
    getUsers :   function(callback) {
        UserModel.find({}, {login: true, role: true}, function (err, users) {
            if(err){
                return callback(err, null);
            }
            else{
                return callback(null, users);
            }
        })
    },


    // *****************************************************************************************************************
    // Change role of the user
    // *****************************************************************************************************************
    changeLoginAndRole :   function(oldLogin, newLogin, newRole, callback) {
        if(!newLogin){
            return callback(new Error("New login not defined"));
        }
        if(newRole !== "admin" && newRole !== "user") {
            return callback(new Error("New role is incorrect"));
        }
        UserModel.findOne({ login: oldLogin }, function(err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error('User ' + login + ' not found'));
            }

            user.login = newLogin;
            user.role = newRole;
            user.save();
            return callback(null);
        });
    },


    // *****************************************************************************************************************
    // Change login of the user
    // *****************************************************************************************************************
    changeRole :   function(login, newRole, callback) {
        UserModel.findOne({ login: login}, function(err, user){
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error('User ' + login + ' not found'));
            }

            user.role = newRole;
            user.save();
            return callback(null);
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
