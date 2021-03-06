
// ========================================
// Router for stations API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var stationManager = require('../libs/station_manager');



// Receiving station list
router.get('/stations', auth().authenticate(), function (req,res) {
    stationManager.getAllStations(function (err, stations) {
        if(err){
            res.json({success: false, error: err.message}).end();
            logger.warn('Receiving station list error: ' + err.message);
        }
        else{
            res.json({success: true, stations: stations}).end();
            logger.info('User '+req.user.login+" got list of stations");
        }
    })
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


// Deleting station
router.delete('/stations/:s_id', auth().authenticate(), function(req,res){
    if(req.user.role == 'admin'){
        stationManager.deleteStation(req.params.s_id, function (err) {
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Deleting station ID='+req.params.s_id+' error: '+err.message);
            }
            else {
                res.json({success: true}).end();
                logger.info('Station ID='+req.params.s_id+' was deleted by '+req.user.login);
            }
        })
    }
    else{
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});


// Editing station
router.put('/stations/:s_id', auth().authenticate(), function(req,res){
    if(req.user.role == 'admin'){
        stationManager.editStation(req.params.s_id, req.body, function(err){
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Editing station ID='+req.params.s_id+' error: '+err.message);
            }
            else{
                res.json({success: true}).end();
                logger.info('Station ID='+req.params.s_id+' ('+req.body.title+') was edited by '+req.user.login);
            }
        })
    }
    else{
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to edit station');
    }
});


// Adding route for the station
router.put('/stations/:s_id/:r_id', auth().authenticate(), function(req,res){
    if(req.user.role == 'admin'){
        stationManager.addRoute(req.params.s_id, req.params.r_id, function(err){
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Addding route for station S_ID='+req.params.s_id+' error: '+err.message);
            }
            else{
                res.json({success: true}).end();
                logger.info('Adding route for station S_ID='+req.params.s_id+' (R_ID='+req.params.r_id+') was done by '+req.user.login);
            }
        })
    }
    else{
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to edit station');
    }
});


// Deleting route from the station
router.delete('/stations/:s_id/:r_id', auth().authenticate(), function(req,res){
    if(req.user.role == 'admin'){
        stationManager.deleteRoute(req.params.s_id, req.params.r_id, function(err){
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Deleting route from station S_ID='+req.params.s_id+' error: '+err.message);
            }
            else{
                res.json({success: true}).end();
                logger.info('Deletting route from station S_ID='+req.params.s_id+' (R_ID='+req.params.r_id+') was done by '+req.user.login);
            }
        })
    }
    else{
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to edit station');
    }
});


module.exports = router;
