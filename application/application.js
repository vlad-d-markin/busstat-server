//точка входа
var express = require("express");
var bodyparser = require("body-parser");
var favicon = require("express-favicon");
var static = require("express-static");
var path = require("path");
var app = express();

//app.use(favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
//app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyparser.json()); // стандартный модуль, для парсинга JSON в запросах
//app.use(express.methodOverride()); // поддержка put и delete
//app.use(app.router); // модуль для простого задания обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.get("/api", function (req, res) {
    res.end("Big brother is watching you...");
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("BusStat server started at " + port);
});