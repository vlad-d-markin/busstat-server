var RouteModel = require('./route_model');
var StationModel = require('./station_model');

module.exports ={
    // Receiving route list
    createRoute   : function (title,transport_type,cost,callback) {
        var new_route = new RouteModel({
            title: title,
            transport_type: transport_type,
            cost: cost
        });
        StationModel.findOne({title:'MININA'},function(err,station){
            if(err){
                return callback(err);
            }
            else{
                new_route.stations.push(new DBRef('Station',station._id ));
            }
        });
        console.log("obj = "+new_route);
        callback(null);
    }

};
