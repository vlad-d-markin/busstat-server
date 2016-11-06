
// *************************************************************
// Testing station_manager.js unit
// *************************************************************


var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var noteManagement = require('./../application/libs/note_manager');
var noteModel = require('./../application/models/note_model');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;



// **********************************
//              TESTS
// **********************************

//Describing
describe('Note Management', function(){
    describe('createNote', function(){
        var r_id = 11;
        var s_id = 1;
        var time = new Date();
        it('correct creating of note', function(done){
            noteManagement.createNote(time,s_id,r_id,function(err){
                expect(err).to.equal(null);
                done();
            })
        });
        it('incorrect time', function(done){
            var time = "VERYBADTIME";
            noteManagement.createNote(time,s_id,r_id,function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal("Incorrect time");
                done();
            })
        });
        it('incorrect station', function(done){
            var bad_s_id=-1;
            noteManagement.createNote(time,bad_s_id,r_id,function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal("Incorrect s_id");
                done();
            })
        });
        it('24 hours are left', function(done){
            var left_time = time;
            left_time.setHours(time.getHours()-25);
            noteManagement.createNote(left_time,s_id,r_id,function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal("Time out");
                done();
            })
        });
        it('time mismatch', function(done){
            var left_time = new Date();
            left_time.setMinutes(left_time.getMinutes()+5);
            noteManagement.createNote(left_time,s_id,r_id,function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal("Time mismatch");
                done();
            })
        });
        after(function (done) {
            noteModel.findOneAndRemove({time: time, s_id: s_id, r_id: r_id}, function (err, note) {
                if (err) throw "Error delete note";
                done();
            });
        });
    })
});