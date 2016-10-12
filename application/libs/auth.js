var passport = require('passport');
var passportJwt = require('passport-jwt');
var config = require('../config');
var logger = require('./logger');
var userManager = require('./user_manager');

var ExtractJwt = passportJwt.ExtractJwt;
var Strategy = passportJwt.Strategy;

var params = {
    secretOrKey: config.token.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    return {
        initialize: function () {
            var strategy = new Strategy(params, function (payload, done) {
                if(payload.exp <= Date.now()) {
                    return done(new Error("Token expired"), null);
                }

                userManager.findUserById(payload.id, function (err, user) {
                    if(err) {
                        return done(err, null);
                    }

                    if(!user) {
                        return done(new Error("User not found", null));
                    }

                    done(null, user);
                });
            });

            passport.use(strategy);

            return passport.initialize();
        },
        
        authenticate: function () {
            return passport.authenticate("jwt", config.token.options);
        }
    }
}

