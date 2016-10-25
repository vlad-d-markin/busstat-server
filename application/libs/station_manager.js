
// ========================================
// Module for managing station objects
// ========================================

var StationModel = require('./station_model');
var logger = require('./logger')(module);



module.exports ={
    //Creating new station
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

    //Deleting station
    deleteStation  : function  (s_id, callback) {
        StationModel.findOneAndRemove({s_id: s_id}, function(err,station){
            if(err){
                return callback(err);
            }
            if(!station){
                return callback(new Error('Failed to delete station. s_id: ' + s_id));
            }
            return callback(null);
        });
    },


    getStations   : function (callback) {
        StationModel.find({},{title:1,s_id:1},function (err,stations) {
            if(err){
                return callback(err,null);
            }
            else{
                return callback(null,stations);
            }
        })
    },


    editStation   : function (s_id, body,callback) {
        if(!s_id)
            return callback(new Error("Station ID not defined"));
        else{
            StationModel.findOne({s_id: s_id}, function(err,station){
                if(err){
                    return callback(err);
                }
                if(!station){
                    return callback(new Error("Station not found"));
                }
                if(!body.title){
                    return callback(new Error("New title not defined"));
                } else {
                    station.title = body.title;
                    station.save();
                    return callback(null);
                }
            })
        }
    }
};