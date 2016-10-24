
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
    },


    getStations   : function (callback) {
        StationModel.find({},{title:1,_id:0},function (err,stations) {
            if(err){
                return callback(err,null);
            }
            else{
                return callback(null,stations);
            }
        })
    },


    editStation   : function (req,callback) {
        if(!req.body.curtitle)
            return callback(new Error("Station title not defined"));
        else{
            StationModel.findOne({title: req.body.curtitle}, function(err,station){
                if(err){
                    return callback(err);
                }
                if(!station){
                    return callback(new Error("Station not found"));
                }
                if(req.body.title){
                    station.title = req.body.title;
                }
                station.save();
                return callback(null);
            })
        }

    }
};