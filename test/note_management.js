
// *************************************************************
// Testing note_manager.js unit
// *************************************************************


var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var noteManagement = require('./../application/libs/note_manager');
var NoteModel = require('./../application/models/note_model');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;


n_id_finder = function (time, s_id, r_id, callback) {
    NoteModel.findOne({time: time, s_id: s_id, r_id: r_id}, function (err, note) {
        if (err) {
            return callback(null, new Error("Find note error"));
        }
        if (!note) {
            return callback(null, new Error("Created note not find"));
        }
        return callback(note.n_id, null);
    });
};

var test_r_id = 11;
var test_s_id = 1;
var test_time = new Date();



// **********************************
//              TESTS
// **********************************

//Describing
describe('Note Management', function(){

    describe('createNote', function(){
        it('correct creating of note', function(done){
            noteManagement.createNote(test_time, test_s_id, test_r_id, function(err){
                           expect(err).to.equal(null);
                done();
            })
        });

        it('incorrect time', function(done){
            var time = "VERYBADTIME";
            noteManagement.createNote(time, test_s_id, test_r_id, function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal('Incorrect time');
                done();
            })
        });

        it('incorrect station', function(done){
            var bad_s_id = -1;
            noteManagement.createNote(test_time, bad_s_id, test_r_id, function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal('Incorrect s_id');
                done();
            })
        });

        it('24 hours are left', function(done){
            var left_hours = 25;
            var left_time = new Date();
            left_time.setHours(left_time.getHours() - left_hours);
            noteManagement.createNote(left_time,test_s_id,test_r_id,function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal('Time out');
                done();
            })
        });

        it('time mismatch', function(done){
            var over_sec = 5;
            var left_time = new Date();
            left_time.setMinutes(left_time.getMinutes() + over_sec);
            noteManagement.createNote(left_time, test_s_id, test_r_id, function(err){
                expect(err).not.equal(null);
                expect(err.message).to.equal('Time mismatch');
                done();
            })
        });
    });

    describe('get all notes', function(){
        it('getting list of notes', function (done) {
            noteManagement.getAllNotes(function (err, notes) {
                expect(err).to.equal(null);
                expect(notes).to.be.a('Array');
                expect(notes[0]).to.have.property('s_id');
                expect(notes[0]).to.have.property('time');
                expect(notes[0]).to.have.property('r_id');
                NoteModel.count({}, function (err, count) {
                    if (err) throw 'Error count notes';
                    expect(notes).to.have.length(count);
                    done();
                });
            });
        });
    });

    describe('delete note', function() {
        it('deleting note', function (done) {
            n_id_finder(test_time, test_s_id, test_r_id, function (test_n_id, err) {
                if (err)
                    done(err);
                noteManagement.deleteNote(test_n_id, function (err){
                    expect(err).to.equal(null);
                    done();
                });
            });
        });
    });

    describe('get note for last n weeks', function() {
        var test_n_weeks = 1;
        var test_date = new Date();
        it('get for last n weeks', function(done) {
            noteManagement.getWeekNote(test_n_weeks,function(err, notes){
                if(err)
                    done(err);
                expect(err).to.equal(null);
                expect(test_date-notes[0].time).to.be.below(1000*60*60*24*7*test_n_weeks);
                expect(test_date-notes[notes.length-1].time).to.be.below(1000*60*60*24*7*test_n_weeks);
                done();
            })
        })
    })
});

