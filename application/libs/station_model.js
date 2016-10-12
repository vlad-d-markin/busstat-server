
// ========================================
// DB Model for stations
// ========================================


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Station = new Schema({
    title: { type: String, required: true }
});

// Validation
Station.path('title').validate(function (v) {
    return v.length > 3 && v.length < 70;
});


var StationModel = mongoose.model('Station', Station);

module.exports = StationModel;
