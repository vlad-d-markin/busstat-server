// Entry point
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('./libs/logger')(module);
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var auth = require('./libs/auth');

var schedule = require('node-schedule');
var statisticsManager = require('./libs/statistics_manager');


// Create express.js app
var app = express();


// Adding middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.static(path.join(__dirname, config.server.staticPath))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)
app.use(auth().initialize());


// Connecting to DB
mongoose.connect(config.db.url);
var db = mongoose.connection;
db.on('open', function () {
    logger.info('Successfully connected to DB ' + config.db.url);
});
db.on('error', function () {
    logger.error('Failed to connect to DB ' + config.db.url);
    process.exit(-1);
});


// Routes
var openRoutes = require('./routes/open');
var userRoutes = require('./routes/users_api');
var stationApiRoutes = require('./routes/stations_api');
var routeApiRoutes = require('./routes/routes_api');
var noteApiRotes = require('./routes/notes_api');
var statisticsApiRotes = require('./routes/statistics_api');
app.use('/', openRoutes);
app.use('/api', userRoutes);
app.use('/api', stationApiRoutes);
app.use('/api', routeApiRoutes);
app.use('/api', noteApiRotes);
app.use('/api', statisticsApiRotes);


app.get('/api_doc', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'docs', 'api_doc.html'));
});


app.get('*', function (req, res){
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

var j = schedule.scheduleJob('10 * * * * *', function() {
    console.log('Statistics was updated / '+Date());
    statisticsManager.updateStatistics(function (err) {
        if(err) {
            console.log('Statistics update error: '+err);
        } else {
            console.log('Statistics was updated!')
        }
    });
});

statisticsManager.updateStatistics(function (err) {
    if(err) {
        console.log('Statistics update error: '+err);
    } else {
        console.log('Statistics was updated!')
    }
});

// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    logger.info("BusStat server started at " + port);
});