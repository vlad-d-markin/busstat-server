var UserModel = require('./user_model');
var logger = require('./logger')(module);
var config = require('../config');

var passport            = require('passport');
var jwt                 = require('jwt-simple');
var LocalStrategy       = require('passport-local').Strategy;
var VKontakteStrategy   = require('passport-vkontakte').Strategy;
var moment              = require('moment');


// Стретегия локальной авторизации
passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, function(username, password, done){
    UserModel.findOne({ login: username}, function(err,user){
        if(err) return err;

        if(user) {
            if (login.checkUser(username, password)) {
                done(null, user);
            } else {

            }
        } else {
            done(null, false, { message: 'Incorrect username.' });
        }
    });
}));


// Для сохранение в сессии информации о пользователе
// Не вызываются напрямую!!
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, { username: username});
});



/*

passport.use(new VKontakteStrategy(
    {
        clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: VKONTAKTE_APP_SECRET,
        callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
    },
    function myVerifyCallbackFn(accessToken, refreshToken, profile, done) {

        // Now that we have user's `profile` as seen by VK, we can
        // use it to find corresponding database records on our side.
        // Here, we have a hypothetical `User` class which does what it says.

        //user.findOne({login: })

        User.findOrCreate({ vkontakteId: profile.id })
            .then(function (user) { done(null, user) })
            .catch(done);
    }
));
*/

var login = {
    checkUser : function (login, password, callback) {
        UserModel.findOne({ login: login, password: password }, function(err, user) {
            if(err) return callback(err, null);
            if(!user) return callback('User not found', null);

            var expires = moment().add(7, 'days').valueOf();

            var token = jwt.encode({
                iss: user._id,
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
            if(err)
                logger.warn('Failed to create user. Login: ' + login + ' Error: ' + JSON.stringify(err));
            callback(err);
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
//module.exports = passport;


