
// ========================================
// Router for user notes API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var noteManager = require('../libs/note_manager');



// Getting all user notes
router.get('/notes', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin'){
        noteManager.getAllNotes(function(err, notes) {
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Getting all user notes by '+res.user.login+' error: '+err.message);
            }
            else{
                res.json({success: true, notes: notes}).end();
                logger.info('User '+req.user.login+' got all user notes');
            }
        })
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to get all user notes');
    }
});


// Creating a user note
router.post('/notes/:s_id/:r_id', auth().authenticate(), function (req, res) {
    noteManager.createNote(req.body.time, req.params.s_id, req.params.r_id, function(err) {
        if(err) {
            console.log('FALSE = ' + err);
            res.json({success: false, error: err.message}).end();
            logger.warn('Adding note by user ' + req.user.login + ' error: ' + err.message);
        }
        if(!err) {
            console.log('TRUE  = '+err);
            res.json({success: true}).end();
            logger.info('User '+req.user.login+' sent note: S_ID = '+req.params.s_id+' R_ID = '
                +req.params.r_id+' TIME = '+req.body.time);
        }
    });
});


// Getting all user notes for certain number of weeks
router.get('/notes/:n_weeks', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin'){
        noteManager.getWeekNote(req.params.n_weeks, function(err, notes) {
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Getting user notes for '+req.params.n_weeks+' weeks by '+req.user.login+' error: '+err.message);
            }
            else{
                res.json({success: true, notes: notes}).end();
                logger.info('User '+req.user.login+' got user notes for '+req.params.n_weeks+' weeks');
            }
        });
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to get user notes for '+req.params.n_weeks+' weeks');
    }
});


// Deleting the note by n_id
router.delete('/notes/:n_id', auth().authenticate(), function (req, res) {
    if(req.user.role == 'admin'){
        noteManager.deleteNote(req.params.n_id, function(err) {
            if(err){
                res.json({success: false, error: err.message}).end();
                logger.warn('Deleting the note N_ID='+req.params.n_id+' by '+req.user.login+' error: '+err.message);
            }
            else{
                res.json({success: true}).end();
                logger.info('User '+req.user.login+' deleted the note N_ID='+req.params.n_id);
            }
        })
    } else {
        res.json({success: false, error: 'Not enough access rights'}).end();
        logger.info('User '+req.user.login+' try to delete the note N_ID'+req.params.n_id);
    }
});


module.exports = router;
