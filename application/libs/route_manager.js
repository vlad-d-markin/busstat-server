
// ========================================
// Module for managing route objects
// ========================================


var RouteModel = require('./../models/route_model');


module.exports ={
    // Receiving route list
    createRoute   :  function (route, callback) {

        if(!route.title || !route.transport_type || !route.cost) {
            return callback(new Error('Incorrect route'));
        }

        var new_route = new RouteModel({
            title: route.title,
            cost: route.cost,
            transport_type: route.transport_type
        });

        new_route.save(function (err) {
            if(err) {
                return callback(err);
            }
            return callback(null);
        });
    },

    // Getting list of routes
    getAllRoutes    :  function (callback) {
        RouteModel.find({},{__v: false, _id: false},function (err, routes) {
            if(err) {
                return callback(err, null);
            } else{
                return callback(null, routes);
            }
        })
    },

    // Getting the route
    getRoute    :  function (r_id, callback) {
        RouteModel.findOne({r_id: r_id}, {__v: false, _id: false}, function (err, route) {
            if(err) {
                return callback(err, null);
            }

            if(!route) {
                return callback(new Error('Route was not exist'), null);
            } else {
                return callback(null, route);
            }
        })
    },

    // Deleting the route
    deleteRoute    :  function (r_id, callback) {
        RouteModel.findOneAndRemove({r_id: r_id}, function(err, route){
            if(err){
                return callback(err);
            }
            if(!route){
                return callback(new Error('Station was not found'));
            }
            return callback(null);
        });
    },

    // Changing the route
    editRoute    :  function (r_id, new_route, callback) {
        RouteModel.findOne({r_id: r_id}, function(err, route){
            if(err){
                return callback(err);
            }
            if(!route){
                return callback(new Error('Route was not found'));
            }

            if(new_route.title) {
                route.title = new_route.title;
            }
            if(new_route.transport_type) {
                route.transport_type = new_route.transport_type;
            }
            if(new_route.cost) {
                route.cost = new_route.cost;
            }
            if(new_route.stations) {
                route.stations = new_route.stations;
            }

            route.save();
            return callback(null);
        });
    }

};
