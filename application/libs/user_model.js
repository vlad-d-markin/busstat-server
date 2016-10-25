
// ========================================
// DB Model for users
// ========================================

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//User table model in DB
var User = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, defaultValue: "user"}             // "user" or "admin"
});

var UserModel = mongoose.model('User', User);

module.exports = UserModel;