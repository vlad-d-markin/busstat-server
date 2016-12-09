
// ========================================
// Module for managing station objects
// ========================================

var StationModel = require('./../models/station_model');
var RouteModel = require('./../models/route_model');


module.exports ={

    // Receiving the station
    getStation   : function (s_id, callback) {
        StationModel.findOne({s_id: s_id}, {title: true, s_id: true, routes: true}, function (err, station) {
            if(err) {
                return callback(err, null);
            }
            if(!station) {
                return callback(new Error('Incorrect s_id'), null);
            }


            return callback(null, station);
        });
    },

    // Receiving station list
    getAllStations   : function (callback) {
        StationModel.find({}, {title: true, s_id: true, routes: true}, function (err,stations) {
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
    },


    // Addding route for the station
    addRoute   : function (s_id, r_id, callback) {
        StationModel.findOne({s_id: s_id}, function (err, station) {
            if (err) {
                return callback(err);
            }
            if (!station) {
                return callback(new Error('Incorrect s_id'));
            }

            RouteModel.findOne({r_id: r_id}, function (err, route) {
                if (err) {
                    return callback(err);
                }
                if (!route) {
                    return callback(new Error('Incorrect r_id'));
                }

                for(var i = 0; i < station.routes.length; i++) {
                    if(station.routes[i] == r_id) {
                        return callback(new Error('Route is added already'));
                    }
                }

                station.routes.push(r_id);
                station.save();
                return callback(null);
            });
        });
    },


    // Deleting route from the station
    deleteRoute  : function (s_id, r_id, callback) {
        StationModel.findOne({s_id: s_id}, function (err, station) {
            if (err) {
                return callback(err);
            }
            if (!station) {
                return callback(new Error('Incorrect s_id'));
            }

            for (var i = 0; i < station.routes.length; i++) {
                if (station.routes[i] == r_id) {
                    station.routes.remove(r_id);
                    station.save();
                    return callback(null);
                }
            }

            return callback(new Error('Route was not found'));
        });
    }
};