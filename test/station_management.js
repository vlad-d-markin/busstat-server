
// *************************************************************
// Testing station_manager.js unit
// *************************************************************


var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var stationManagement = require('./../application/libs/station_manager');
var StationModel = require('./../application/models/station_model');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;



var s_id_finder = function(title, callback) {
    StationModel.findOne({title: title}, function(err,station) {
        if (err) {
            return callback(null, new Error("Find station error"));
        }
        if (!station) {
            return callback(null, new Error("S_ID_FINDER station error"));
        }
        return callback(station.s_id, null);
    });
};



// **********************************
//              TESTS
// **********************************

describe('Station management', function () {

    // Getting all stations
    describe('getStation', function () {
        it('getting list of station', function (done) {
            stationManagement.getAllStations(function (err, stations) {
                expect(err).to.equal(null);
                expect(stations).to.be.a('Array');
                expect(stations[0]).to.have.property('_id');
                expect(stations[0]).to.have.property('s_id');
                expect(stations[0]).to.have.property('title');
                StationModel.count({}, function (err, count) {
                    if (err) throw 'Error count station';
                    expect(stations).to.have.length(count);
                    done();
                });
            });
        });
    });


    // Creating new station
    describe('createStation', function () {
         var test_title = 'TEST_STATION_TITLE';

         after(function () {
             StationModel.findOneAndRemove({title: test_title}, function (err, station) {
                 if (err) throw "Error delete station";
             });
         });


         it('invalid station title (too few symbols)', function (done) {
             var title = 'TS';
             stationManagement.createStation(title, function (err) {
                 expect(err).not.equal(null);
                 expect(err.name).to.equal('ValidationError');
                 done();
             });
         });

         it('invalid station title (too many symbols)', function (done) {
             var title = 'TEST_STATION_TITLE__123456789_123456789_123456789_123456789_123456789_END';
             stationManagement.createStation(title, function (err) {
                 expect(err).not.equal(null);
                 expect(err.name).to.equal('ValidationError');
                 done();
             });
         });

         it('valid station title', function (done) {
             stationManagement.createStation(test_title, function (err) {
                 if(err) throw err;
                 StationModel.findOne({title: test_title}, function (err, station) {
                     if (err) throw "Error find station title";

                     expect(station).to.have.property('title');
                     expect(station.title).to.equal(test_title);
                     done();
                 });
             });
         });

     });


    // Editing
    describe('editStation', function () {
        var test_title = 'TEST_STATION_TITLE';
        var test_new_title = 'NEW_STATION_TITLE';
        var test_good_body = { title: test_new_title };
        var test_bad_body = { title1: test_new_title };

        before(function(done){
            var new_station = new StationModel( {title: test_title} );
            new_station.save(function (err) {
                if(err) throw new Error("Creating station error");
                done();
            });
        });

        after(function(done){
            s_id_finder(test_new_title, function(test_s_id, err) {
                if(err)
                    done(err);

                stationManagement.deleteStation(test_s_id, function (err) { done(err); } );
            });
        });


        it('invalid station s_id', function (done) {
            var bad_s_id = -1;
            stationManagement.editStation(bad_s_id, test_good_body, function (err) {
                expect(err).not.equal(null);
                expect(err.message).to.equal('Station was not found');
                done();
            });
        });

        it('not defined new title', function (done) {
            s_id_finder(test_title, function(test_s_id, err) {
                if(err)
                    throw err;

                stationManagement.editStation(test_s_id, test_bad_body, function (err) {
                    expect(err).not.equal(null);
                    expect(err.message).to.equal('New title not defined');
                    done();
                });
            });
        });

        it('correct editing', function (done) {
            s_id_finder(test_title, function(test_s_id, err) {
                if(err)
                    throw err;

                stationManagement.editStation(test_s_id, test_good_body, function (err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

    });


    // Deleting
    describe('deleteStation', function () {
        var test_title = 'TEST_STATION_DELETION_TITLE';

        before(function (done) {
            var new_station = new StationModel({title: test_title});
            new_station.save(function (err) {
                done(err);
            });
        });

        after(function () {
            s_id_finder(test_title, function (test_s_id) {
                stationManagement.deleteStation(test_s_id, function (err) {
                    done(err);
                });
            });
        });


        it('invalid station s_id', function (done) {
            var test_s_id = -1;
            stationManagement.deleteStation(test_s_id, function (err) {
                expect(err).not.equal(null);
                expect(err.message).to.equal('Station was not found');
                done();
            });
        });

        it('valid station s_id', function (done) {
            s_id_finder(test_title, function (test_s_id) {
                stationManagement.deleteStation(test_s_id, function (err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });
    });
});




