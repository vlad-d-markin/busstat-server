var mongoose    = require('mongoose');
var log         = require('./logger')(module);

mongoose.connect('mongodb://busstat-dbuser:petuh@ds035026.mlab.com:35026/busstat-db');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});


var Schema = mongoose.Schema;

// Schemas

var Station = new Schema({
    title: { type: String, required: true }
});

// validation
Station.path('title').validate(function (v) {
    return v.length > 3 && v.length < 70;
});

var StationModel = mongoose.model('Station', Station);

module.exports.StationModel = StationModel;