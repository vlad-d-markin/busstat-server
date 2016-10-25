
// ========================================
// Router for open endpoints
// ========================================

var express = require('express');
var router = express.Router();
var userManager = require('../libs/user_manager');
var logger = require('../libs/logger')(module);


// Registration of new User
router.post('/registration', function (req, res) {
    userManager.createUser(req.body.login, req.body.password, 'user', function (err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn('Creating user '+req.body.login+' error: '+err.message);
        }
        else {
            res.json({success: true, token: 'HERE_WILL_BE_TOKEN'}).end();
            logger.info('User was created. Login: ' + req.body.login);
        }
    })
});


// Route for requesting tokens
router.post('/token', function (req, res) {
    userManager.requestToken(req.body.login, req.body.password, function (err, user) {
        if(err) {
            res.json({ success: false, error: err.message});
            logger.warn('Requesting token error: '+err.message);
        }
        else {
            res.json({success: true, token: user.token}).end();
            logger.info('Requesting '+req.body.login+'\'s token was successful');
        }
    });
});


module.exports = router;