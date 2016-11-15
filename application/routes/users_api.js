
// ========================================
// Router for users API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var userManager = require('../libs/user_manager');


// Autharization of new User
router.get('/test', auth().authenticate(), function (req, res) {
    res.json({ success: true, message: "Test api call", user: req.user}).end();
});



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


// Changing login of user by user
router.put('/users/login',auth().authenticate(), function (req, res) {
    userManager.changeLoginAndRole(req.user.login, req.body.login, "user", function(err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn('['+req.user.login+']: changing login error: '+err.message);
        } else {
            res.json({success: true}).end();
            logger.warn('['+req.user.login+']: changed login on: '+req.body.login);
        }
    });
});


// Changing login of user by admin
router.put('/users/login/:oldLogin', auth().authenticate(), function (req, res){
    if(req.user.role == 'admin') {
        userManager.changeLoginAndRole(req.params.oldLogin, req.body.login, req.body.role, function(err) {
            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('['+req.user.login+']: changing login error: '+err.message);
            } else {
                res.json({success: true}).end();
                logger.warn('['+req.user.login+']: changed login and role: '+req.body.login+"  "+req.body.role);
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to change login and role of '+req.params.oldLogin);
    }
});


// Changing login of user by user
router.put('/users/password',auth().authenticate(), function (req, res) {
    userManager.changePassword(req.user.login, req.body.password, req.body.newPassword, function(err) {
        if(err) {
            res.json({success: false, error: err.message}).end();
            logger.warn('['+req.user.login+']: changing password error: '+err.message);
        } else {
            res.json({success: true}).end();
            logger.warn('['+req.user.login+']: changed password');
        }
    });
});


// Changing login of user by admin
router.put('/users/password/:login', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        userManager.changePassword(req.params.login, req.body.password, req.body.newPassword, function(err) {
            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('['+req.user.login+']: changing password of '+req.params.login+' error: '+err.message);
            } else {
                res.json({success: true }).end();
                logger.warn('['+req.user.login+']: changed password of '+req.params.login);
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to change password of user '+req.params.login);
    }
});

// Deleting the user by admin
router.delete('/users/:login', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        userManager.removeUser(req.params.login, function(err) {
            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('['+req.user.login+']: deleting user error: '+err.message);
            } else {
                res.json({success: true}).end();
                logger.warn('['+req.user.login+']: deleted user: '+req.params.login);
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete user '+req.params.login);
    }
});


module.exports = router;
