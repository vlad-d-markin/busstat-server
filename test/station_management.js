
// *************************************************************
// Testing station_manager.js unit
// *************************************************************


var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var stationManagement = require('./../application/libs/station_manager');
var StationModel = require('./../application/libs/station_model');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;



var s_id_finder = function(title, callback) {
    StationModel.findOne({title: title}, function(err,station) {
        if (err) throw new Error("Find station error");
        if (!station) throw new Error("S_ID_FINDER station error");
        return callback(station.s_id);
    });
};



// **********************************
//              TESTS
// **********************************

describe('Station management', function () {

    // Getting all stations
    describe('getStation()', function () {
        it('getting list of station', function (done) {
            stationManagement.getStations(function (err, stations) {
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
    describe('createStation()', function () {

         var test_title = 'TEST_STATION_TITLE';

         after(function () {
             StationModel.findOneAndRemove({title: test_title}, function (err, station) {
                 if (err) throw "Error delete station";
             });
         });


         it('invalid station title (too few symbols)', function (done) {
             var title = 'TS'
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
                 StationModel.findOne({title: test_title}, function (err, station) {
                     if (err) throw "Error find station title";

                     expect(station).to.have.property('title');
                     expect(station.title).to.equal(test_title);
                     done();
                 });
             });
         });

     });


    // Deleting
    describe('deleteStation()', function () {
        var test_title = 'TEST_STATION_TITLE';

        before(function () {
            var new_station = new StationModel({title: test_title});
            new_station.save(function (err) {
                if (err) throw "Creating station error";
            });
        });

        after(function () {
            s_id_finder(test_title, function (test_s_id) {
                stationManagement.deleteStation(test_s_id, function (err) {
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

/* TODO: WTF EXCEPRION!?
describe('Station management: editStation()', function () {
    var test_title = 'TEST_STATION_TITLE';
    var test_new_title = 'NEW_STATION_TITLE';
    var test_good_body = { title: test_new_title };
    var test_bad_body = { title1: test_new_title };

    before(function(){
        var new_station = new StationModel( {title: test_title} );
        new_station.save(function (err) {
            if(err) throw "Creating station error";
        });
    });

    after(function(){
        s_id_finder(test_new_title, function(test_s_id) {
            stationManagement.deleteStation(test_s_id, function (err) {} );
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
        s_id_finder(test_title, function(test_s_id) {
            stationManagement.editStation(test_s_id, test_bad_body, function (err) {
                expect(err).not.equal(null);
                expect(err.message).to.equal('Station was not found');
                done();
            });
        });
    });

    it('correct editing', function (done) {
        s_id_finder(test_title, function(test_s_id) {
            stationManagement.editStation(test_s_id, test_good_body, function (err) {
                expect(err).to.equal(null);
                done();
            });
        });
    });

});
*/