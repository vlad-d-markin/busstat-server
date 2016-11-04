
// ========================================
// Router for API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var stationManager = require('../libs/station_manager');
var auth = require('../libs/auth');
var routeManager = require('../libs/route_manager');


// Autharization of new User
router.get('/test', auth().authenticate(), function (req, res) {
    res.json({ success: true, message: "Test api call", user: req.user}).end();
});


// Receiving station list
router.get('/stations', auth().authenticate(), function (req,res) {
    stationManager.getStations(function (err, stations) {
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


// Gettong list of routes
router.get('/routes', auth().authenticate(), function (req,res) {
    routeManager.getAllRoutes(function (err, routes) {
        if(err){
            res.json({success: false, error: err.message}).end();
            logger.info('User '+req.user.login+' try to got list of routes');
        } else{
            res.json({success: true, routes: routes}).end();
            logger.info('User '+req.user.login+' got list of routes');
        }
    })
});

// Getting the route
router.get('/routes/:s_id', auth().authenticate(), function (req,res) {
    routeManager.getRoute(req.params.s_id, function (err, route) {
        if(err){
            res.json({success: false, error: err.message}).end();
            logger.warn('User '+req.user.login+' try to got route S_ID='+req.params.s_id);
        } else{
            res.json({success: true, route: route}).end();
            logger.info('User '+req.user.login+' got route "'+route.title+'"');
        }
    })
});

// Creating station
router.post('/routes', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin') {
        routeManager.createRoute(req.body, function(err) {
            if(err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('User '+req.user.login+' try to create new route');
            } else {
                res.json({success: true}).end();
                logger.info('User '+req.user.login+' create route new route "'+req.body.title+'"');
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});

// Deleting the route
router.delete('/routes/:s_id', auth().authenticate(), function (req,res) {
    if(req.user.role == 'admin') {
        routeManager.deleteRoute(req.params.s_id, function (err) {
            if (err){
                res.json({success: false, error: err.message}).end();
                logger.warn('User '+req.user.login+' try to delete route S_ID='+req.params.s_id);
            } else {
                res.json({success: true}).end();
                logger.info('User '+req.user.login+' delete route S_ID='+req.params.s_id)
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});

// Editting the route
router.put('/routes/:s_id', auth().authenticate(), function(req, res) {
    if(req.user.role == 'admin') {
        routeManager.editRoute(req.params.s_id, req.body, function (err) {
            if (err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('Admin '+req.user.login+' try to change route S_ID='+req.params.s_id);
            } else {
                res.json({success: true}).end();
                logger.info('Admin '+req.user.login+' changed route S_ID='+req.params.s_id);
            }
        })
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});


module.exports = router;





















