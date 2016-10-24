
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
            }
        });
    },

    //Deleting station
    deleteStation  : function  (title, callback) {
        StationModel.findOneAndRemove({title: title}, function(err,station){
            if(err){
                return callback(err);
            }
            if(!station){
                return callback(new Error('Failed to delete station. Title: ' + title));
            }
            return callback(null);
        });
    }
};