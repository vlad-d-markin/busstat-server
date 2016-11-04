
// ========================================
// Router for routes API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var routeManager = require('../libs/route_manager');



// Getting list of routes
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
router.get('/routes/:r_id', auth().authenticate(), function (req,res) {
    routeManager.getRoute(req.params.r_id, function (err, route) {
        if(err){
            res.json({success: false, error: err.message}).end();
            logger.warn('User '+req.user.login+' try to got route R_ID='+req.params.r_id);
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
router.delete('/routes/:r_id', auth().authenticate(), function (req,res) {
    if(req.user.role == 'admin') {
        routeManager.deleteRoute(req.params.r_id, function (err) {
            if (err){
                res.json({success: false, error: err.message}).end();
                logger.warn('User '+req.user.login+' try to delete route R_ID='+req.params.r_id);
            } else {
                res.json({success: true}).end();
                logger.info('User '+req.user.login+' delete route R_ID='+req.params.r_id)
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});


// Editting the route
router.put('/routes/:r_id', auth().authenticate(), function(req, res) {
    if(req.user.role == 'admin') {
        routeManager.editRoute(req.params.r_id, req.body, function (err) {
            if (err) {
                res.json({success: false, error: err.message}).end();
                logger.warn('Admin '+req.user.login+' try to change route R_ID='+req.params.r_id);
            } else {
                res.json({success: true}).end();
                logger.info('Admin '+req.user.login+' changed route R_ID='+req.params.r_id);
            }
        })
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete station');
    }
});


module.exports = router;
