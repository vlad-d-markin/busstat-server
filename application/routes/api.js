
// ========================================
// Router for API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var stationManager = require('../libs/station_manager');
var auth = require('../libs/auth');

// Autharization of new User
router.get('/test', auth().authenticate(), function (req, res) {
    res.json({ success: true, message: "Test api call", user: req.user}).end();
});

//Creation of new station
router.post('/stations', auth().authenticate(), function(req,res){
    if(req.user.role =='admin') {
        stationManager.createStation(req.body.title, function (err) {
            if (err) {
                res.json({success: false, error: err.message}).end();
                logger.warn(' Error: ' + err.message);
            }
            else {
                res.json({success: true}).end();
                logger.info('Station created. Title: ' + req.body.title);
            }
        })
    }
    else{
        res.json({success: false, error: 'you are not admin'}).end();
        logger.info('Station not created. You are not admin.');
    }
});


//Deleting station
router.delete('/stations', auth().authenticate(), function(req,res){
    if(req.user.role == 'admin'){
        stationManager.deleteStation(req.body.title, function (err) {
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn(' Error: ' + err.message);
            }
            else {
                res.json({success: true}).end();
                logger.info('Station deleted. Title: ' + req.body.title);
            }
        })
    }
    else{
        res.json({success: false, error: 'you are not admin'}).end();
        logger.info('Station not deleted. You are not admin.');
    }
});
module.exports = router;