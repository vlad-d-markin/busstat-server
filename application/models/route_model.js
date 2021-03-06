var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");


// Station table model in DB
var Route = new Schema({
    title:          { type: String, required: true, unique: false },
    transport_type: { type: String, required: true },
    cost:           { type: Number, required: true },
    r_id:           { type: Number }
});


// Configure id autoincrement
autoIncrement.initialize(mongoose.connection);
Route.plugin(autoIncrement.plugin, {
    model:      'Route',
    field:      'r_id',
    startAt:     0,
    incrementBy: 1
});


var RouteModel = mongoose.model('Route', Route);

module.exports = RouteModel;