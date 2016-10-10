var StationModel = require('./station_model');
var logger = require('./logger')(module);


var apicalls = {
    getStations : function () {
        return StationModel.find(function (err, stations) {
            if(!err) {
                return stations;
            }
            else {
                throw err;
            }
        });
    },

    addStation : function (title) {
        var new_station = new StationModel({
            title : title
        });

        new_station.save(function (err) {
            throw err;
        });
    }


};


module.exports.setHandlers = function (app) {
    // Get list of all stations
    app.get('/api/stations', function (req, res) {
        try {
            var stations = apicalls.getStations();
            res.end(stations);
        }
        catch (e) {
            res.statusCode = 500;
            res.end({ status : 'FAIL', error : e});
            logger.warn('Failed to get stations [getStations()]' + JSON.stringify(e));
        }
    });

    // Add station
};



