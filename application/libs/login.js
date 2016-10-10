var UserModel = require('./user_model');
var logger = require('./logger')(module);


var login = {
    checkUser : function (login, password) {

    },

    createUser : function (login, password) {
        var new_user = new UserModel({
            login: login,
            password: password,
            role: 'user'
        });

        user.save(function (err) {
            logger.warn('Failed to create user. Login: ' + login + ' Error: ' + JSON.stringify(err));
            throw err;
        });
    }

};


module.exports = login;


