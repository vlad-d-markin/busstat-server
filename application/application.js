// Entry point
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var logger = require('./libs/logger')(module);
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var handlers = require('./libs/handlers');


// Create express.js app
var app = express();


// Adding middleware
app.use(morgan("dev"));
app.use(bodyparser.json()); // стандартный модуль, для парсинга JSON в запросах
//app.use(express.methodOverride()); // поддержка put и delete
app.use(express.static(path.join(__dirname, config.server.staticPath))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


// Connecting to DB
mongoose.connect(config.db.url);
var db = mongoose.connection;
db.on('open', function () {
    logger.info('Successfully connected to ' + config.db.url);
});
db.on('error', function () {
    logger.error('Failed to connect to ' + config.db.url);
    process.exit(-1);
})


// Routes
handlers.setHandlers(app);


// app.post('/api/stations', function(req, res) {
//     var station = new StationModel({
//         title: req.body.title
//     });
//
//     station.save(function (err) {
//         if (!err) {
//             logger.info("station created");
//             return res.send({ status: 'OK'});
//         } else {
//             console.log(err);
//             if(err.name == 'ValidationError') {
//                 res.statusCode = 400;
//                 res.send({ error: 'Validation error' });
//             } else {
//                 res.statusCode = 500;
//                 res.send({ error: 'Server error' });
//             }
//             logger.error('Internal error(%d): %s',res.statusCode,err.message);
//         }
//     });
// });


// Server launch
var port = process.env.PORT || config.server.defaultPort;
app.listen(port, function() {
    logger.info("BusStat server started at " + port);
});