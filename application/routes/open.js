var express = require('express');
var router = express.Router();
var userManager = require('../libs/user_manager');
var logger = require('../libs/logger')(module);
var bodyParser = require('body-parser');

//router.use(bodyParser.json());

router.post('/registration', function (req, res) {
    userManager.createUser(req.body.login, req.body.password, function (err) {
        if(err) {
            res.json({success: false, error: err}).end();
            logger.warn('Failed to create user with login ' + req.body.login + ' Error: ' + JSON.stringify(err));
        }
        else {
            res.json({success: true, token: 'HERE_WILL_BE_TOKEN'}).end();
            logger.info('User created. Login: ' + req.body.login);
        }
    })
});



router.post('/token', function (req, res) {
    if(req.body.login && req.body.password) {
        var login = req.body.login;
        var password = req.body.password;

        userManager.requestToken(login, password, function (err, user) {
            if(err) {
                res.json({ success: false, error: err.message});
                logger.warn("Error happened during requesting token");
                return;
            }

            res.json({success: true, token: user.token}).end();
        });
    }
    else {
        logger.warn("Login and (or) password are not provided");
        res.json({success: false, error: "Login and (or) password are not provided"}).end();
    }
});


module.exports = router;