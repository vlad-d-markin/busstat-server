var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, defaultValue: "user"}
});

// Validation



var UserModel = mongoose.model('Station', User);

module.exports = UserModel;