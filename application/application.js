var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.end("Big brother is watching you...");
});

app.listen(8000, function() {
    console.log("BusStat server started at 8000");
});