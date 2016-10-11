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

module.exports.jwtauth = userManager.checkToken;


module.exports.setHandlers = function (app) {
    // User management
    app.post('/signup', function (req, res) {

        userManager.createUser(req.body.login, req.body.password, function (err) {
            if(err)
                res.json({ status: 'FAIL', error : e });
            else
                res.json({ status: 'OK', success: true }); // + token: , -status
        });
    });


    app.post('/login', function (req, res) {
        userManager.checkUser(req.body.login, req.body.password, function (err, user) {
            logger.debug(req.body.login+"---"+req.body.password);
            logger.debug(req.body);
            if(err)
               res.json({ status: 'FAIL', error : err });
           else
               res.json({ token: user.token});
        });
    });

    // Local login
    app.post('/login/local', function (req, res) {

        passport.authenticate('local', {
            failureRedirect: '/login',          // маршурты перенаправления
            successRedirect: '/'
        });
    });


    app.get('/api/test', function (req, res) {
        res.end("SECRET CONTENT");
    });


    // VK login
    app.get('/login/vk',
        //passport.authenticate('vkontakte'),
        function (req, res) {
            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
            res.json({ status : 'VK!!!!1'});
        });

    app.get('/auth/vkontakte/callback',
        //passport.authenticate('vkontakte', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
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



