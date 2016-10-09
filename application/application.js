//точка входа
var express = require("express");
var bodyparser = require("body-parser");
//var favicon = require("express-favicon");
var path = require("path");
var log = require('./libs/logger')(module);
var morgan = require('morgan');
var app = express();
var StationModel = require('./libs/mongoose').StationModel;

//module using
//app.use(favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
app.use(morgan("dev"));
app.use(bodyparser.json()); // стандартный модуль, для парсинга JSON в запросах
//app.use(express.methodOverride()); // поддержка put и delete
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


//routes
app.get("/api", function (req, res) {
    res.end("Big brother is watching you...");
});

app.get('/api/stations', function(req, res) {
    return StationModel.find(function (err, stations) {
        if (!err) {
            return res.send(stations);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

app.post('/api/stations', function(req, res) {
    var station = new StationModel({
        title: req.body.title
    });

    station.save(function (err) {
        if (!err) {
            log.info("station created");
            return res.send({ status: 'OK'});
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

//server launch
var port = process.env.PORT || 8000;
app.listen(port, function() {
    log.info("BusStat server started at " + port);
});