
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


// Creation new station
router.post('/stations', auth().authenticate(), function(req,res){
    if(req.user.role =='admin') {
        stationManager.createStation(req.body.title, function (err) {
            if (err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('Creating <'+req.body.title+'> station error: ' + err.message);
            }
            else {
                res.json({success: true}).end();
                logger.info('New station <'+req.body.title+'> was created by '+req.user.login);
            }
        })
    }
    else{
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to create new station');
    }
});

module.exports = router;
