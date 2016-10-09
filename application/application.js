//точка входа
var express = require("express");
var bodyparser = require("body-parser");
//var favicon = require("express-favicon");
//var express_static = require("express-static");
var path = require("path");
var log = require('./libs/logger')(module);
var morgan = require('morgan');
var app = express();

//module using
//app.use(favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
//app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
app.use(morgan("dev"));
app.use(bodyparser.json()); // стандартный модуль, для парсинга JSON в запросах
//app.use(express.methodOverride()); // поддержка put и delete
//app.use(app.router); // модуль для простого задания обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

//error handlers
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

//routes
app.get("/api", function (req, res) {
    res.end("Big brother is watching you...");
});

//server launch
var port = process.env.PORT || 8000;
app.listen(port, function() {
    log.info("BusStat server started at " + port);
});