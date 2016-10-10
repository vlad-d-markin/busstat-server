var StationModel = require('./station_model');
var logger = require('./logger')(module);
var userManager = require('./login');


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
    // User management
    app.post('/signup', function (req, res) {
        try {
            userManager.createUser(req.body.login, req.body.password);
            res.json({ status: 'OK', success: true });
        }
        catch (e) {
            res.json({ status: 'FAIL', error : e });
        }
    });


    // Get list of all stations
    app.get('/api/stations', function (req, res) {
        try {
            var stations = apicalls.getStations();
            res.json(stations);
        }
        catch (e) {
            res.statusCode = 500;
            res.json({ status : 'FAIL', error : e});
            logger.warn('Failed to get stations [getStations()]' + JSON.stringify(e));
        }
    });

    // Add station
};



