var UserModel = require('./user_model');
var logger = require('./logger')(module);
var config = require('../config');
var moment = require('moment');
var jwt = require('jwt-simple');



var login = {
    requestToken  : function (login, password, callback) {
        UserModel.findOne({ login: login, password: password }, function(err, user) {
            if(err) return callback(err, null);
            if(!user) return callback(new Error('User ' + login + ' not found'), null);

            var expires = moment().add(7, 'days').valueOf();

            var token = jwt.encode({
                id: user._id,
                exp: expires
            }, config.token.secret);

            user.token = token;
            callback(null, user);
        });
    },


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

    findUserById : function (id, cb) {
        UserModel.findOne({_id: id}, function(err, user) {
            cb(err, user);
        });
    },

    checkToken : function (req, res, next) {
        var token = (req.body && req.body.token) || req.headers['x-access-token'];
        if (token) {
            try {
                var decoded = jwt.decode(token, config.token.secret);

                if (decoded.exp <= Date.now()) {
                    res.json({status: "FAIL", message: "Token expired"});
                    res.end();
                    return;
                }
                UserModel.find({_id:decoded.iss}, function (err, user) {
                    if(err) {
                        res.json({status: "FAIL", message: err});
                        res.end();
                        return;
                    }
                    req.user = user;
                    return next();
                });
            } catch (err) {
                return next();
            }
        } else {
            res.json({status: "FAIL", message: "Token not provided"});
            res.end();
            return;
        }
    }
};


module.exports = login;


