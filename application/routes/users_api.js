
// ========================================
// Router for users API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var userManager = require('../libs/user_manager');



// Getting list of all users (login + role)
router.get('/users', auth().authenticate(), function (req, res) {
   if(req.user.role == 'admin') {
        userManager.getUsers(function (err, users) {
           if(err) {
               res.json({success: false, error: err.message}).end();
               logger.warn('['+req.user.login+']: getting list of all users error: '+err.message);
           } else {
               res.json({success: true, users: users}).end();
               logger.info('['+req.user.login+']: got list of all users');
           }
        });
   } else {
       res.json({success: false, error: 'Not enough access rights'}).end();
       logger.info('User '+req.user.login+' try to get list of users');
   }
});


// Registration of new Admin
router.post('/admin', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        userManager.createUser(req.body.login, req.body.password, 'admin', function (err) {
            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('['+req.user.login+']: creating admin error: '+err.message);
            } else {
                userManager.requestToken(req.body.login, req.body.password, function(err, user) {
                    if(err) {
                        res.json({success: false, error: err.message}).end();
                        logger.warn('['+req.user.login+']: requesting token error (create admin): '+err.message);
                    } else {
                        res.json({success: true, token: user.token}).end();
                        logger.info('['+req.user.login+']: created new admin. Login: ' + req.body.login);
                    }
                });
            }
        })
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to create new admin');
    }
});



module.exports = router;
