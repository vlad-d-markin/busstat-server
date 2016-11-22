var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Pair = new Schema({
    time: { type: String, required: true },
    count: { type: Number, required: true, default: 0 }
});

// Statistics table model in DB
var Statistics = new Schema({
    s_id:           { type: Number, required: true },
    r_id:           { type: Number, required: true },

    weekdaysCount:  { type: [Pair], required: true },
    fridayCount:    { type: [Pair], required: true },
    weekendCount:   { type: [Pair], required: true },

    weekdaysFreq:   { type: [Pair], required: true },
    fridayFreq:     { type: [Pair], required: true },
    weekendFreq:    { type: [Pair], required: true }
});


var StatisticsModel = mongoose.model('Statistics', Statistics);

module.exports = StatisticsModel;