var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.end("Big brother is watching you...");
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("BusStat server started at " + port);
});