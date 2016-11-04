
// ========================================
// Module for managing station objects
// ========================================

var StationModel = require('./../models/station_model');


module.exports ={

    // Receiving the station
    getStation   : function (s_id, callback) {
        StationModel.findOne({s_id: s_id}, {title: true, s_id: true}, function (err, station) {
            if(err) {
                return callback(err, null);
            }
            if(!station) {
                return callback(new Error('Station was not exist'), null);
            }


            return callback(null, station);
        });
    },

    // Receiving station list
    getAllStations   : function (callback) {
        StationModel.find({}, {title: true, s_id: true}, function (err,stations) {
            if(err){
                return callback(err,null);
            }
            else{
                return callback(null,stations);
            }
        })
    },

    // Creating new station
    createStation  : function (title, callback) {
        var new_station = new StationModel({
            title: title
        });
        new_station.save(function (err) {
            if(err){
                return callback(err);
            } else {
                callback(null);
            }
        });
    },

    // Deleting station
    deleteStation  : function  (s_id, callback) {
        StationModel.findOneAndRemove({s_id: s_id}, function(err,station){
            if(err){
                return callback(err);
            }
            if(!station){
                return callback(new Error('Station was not found'));
            }
            return callback(null);
        });
    },

    // Editing station
    editStation   : function (s_id, body, callback) {
        if(!body.title){
            return callback(new Error("New title not defined"));
        }
        StationModel.findOne({s_id: s_id}, function(err,station){
            if(err){
                return callback(err);
            }
            if(!station){
                return callback(new Error('Station was not found'));
            }

            station.title = body.title;
            station.save();
            return callback(null);
        })
    }
};