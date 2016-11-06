
// ========================================
// Module for managing user notes objects
// ========================================


var NoteModel = require('./../models/note_model');
var routeManager = require('./route_manager');
var stationManager = require('./station_manager');

var MAX_AHEAD = new Date(2*60*1000);
var MAX_LAG = new Date(24*60*60*1000);


module.exports = {

    // Creating a user note
    createNote: function (time, s_id, r_id, callback) {
        var note_time = Date.parse(time);
        if (isNaN(note_time) == true) {
            return callback(new Error('Incorrect time'));
        }

        var serv_time = Date.now();
        if( (note_time - serv_time) > MAX_AHEAD ) {
            return callback(new Error('Time mismatch'));
        }
        if( (serv_time - note_time) > MAX_LAG ) {
            return callback(new Error('Time out'));
        }

        stationManager.getStation(s_id, function(err, station) {
            if(err) {
                return callback(err,null);
            }
            if(!station) {
                return callback(new Error('Incorrect s_id'));
            }

            routeManager.getRoute(r_id, function(err, route) {
                if(err) {
                    return callback(err,null);
                }
                if(!route) {
                    return callback(new Error('Incorrect r_id'))
                }

                var new_note = new NoteModel({
                    time: time,
                    s_id: s_id,
                    r_id: r_id
                });

                new_note.save(function (err) {
                    if(err) {
                        return callback(err);
                    }
                    return callback(null);
                });
            });
        });
    },


    // Getting all user notes
    getAllNotes   : function (callback) {
        NoteModel.find({},{__v: false, _id: false},function(err, notes) {
            if(err) {
                return callback(err, null);
            } else {
                return callback(null,notes);
            }
        });
    },


    // Deleting the note
    deleteNote   : function (n_id, callback) {
        NoteModel.findOneAndRemove({n_id: n_id}, function(err, note){
            if(err){
                return callback(err);
            }
            if(!note) {
                return callback(new Error('Note was not found'));
            }
            return callback(null);
        });
    },


    // Getting notes by last n week
    getWeekNote   : function (n_weeks, callback) {
        if(n_weeks <= 0) {
            return callback(new Error('Incorrect number of weeks'));
        }

        var rightTime = new Date();
        var leftTime = new Date(rightTime - n_weeks*(7*24*60*60*1000));

        NoteModel.find( {time: {$gte: leftTime, $lte: rightTime}}, {__v: false, _id: false}, function(err, notes) {
            if(err){
                return callback(err, null);
            }
            console.log(notes);
            return callback(null, notes);
        });
    }

};