// Entry point
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('./libs/logger')(module);
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var auth = require('./libs/auth');
var userMan = require('./libs/user_manager');


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
var apiRoutes = require('./routes/api');
var openRoutes = require('./routes/open');
app.use('/', openRoutes);
app.use('/api', apiRoutes);



// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    logger.info("BusStat server started at " + port);
});