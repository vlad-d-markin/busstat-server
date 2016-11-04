var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");


// user note model in DB
var Note = new Schema({
    n_id: { type: Number, required: true },
    time: { type: Date, required: true },
    s_id: { type: Number, required: true },
    r_id: { type: Number, required: true }
});


// Configure id autoincrement
autoIncrement.initialize(mongoose.connection);
Note.plugin(autoIncrement.plugin, {
    model:      'Note',
    field:      'n_id',
    startAt:     0,
    incrementBy: 1
});


var NoteModel = mongoose.model('Note', Note);

module.exports = NoteModel;