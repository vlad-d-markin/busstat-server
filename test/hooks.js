
// *************************************************************
// Root level hooks
// *************************************************************


var mongoose = require('mongoose');
var config = require('../application/config');


// Connect to DB
before('connect to DB', function (done) {
    mongoose.connect(config.db.url);

    var db = mongoose.connection;
    db.on('open', function () {
        done();
    });
    db.on('error', function () {
        throw Error("Failed to connect to DB");
    });
});


after('disconnect from DB', function(done) {
    mongoose.disconnect(done);
});