
// ========================================
// DB Model for stations
// ========================================


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");


// Station table model in DB
var Station = new Schema({
    title: { type: String, required: true, unique: true },
    s_id: { type: Number }
});

// Configure id autoincrement
autoIncrement.initialize(mongoose.connection);
Station.plugin(autoIncrement.plugin, {
    model: 'Station',
    field: 's_id',
    startAt: 0,
    incrementBy: 1
});

// Validation
Station.path('title').validate(function (v) {
    return v.length > 3 && v.length < 70;
});


var StationModel = mongoose.model('Station', Station);


module.exports = StationModel;
