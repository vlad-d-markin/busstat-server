
// *************************************************************
//             Testing route_manager.js unit
// *************************************************************

var config = require('./../application/config');
var chai = require('chai');
var expect = chai.expect;
var routeManagement = require('./../application/libs/route_manager');
var RouteModel = require('./../application/models/route_model');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Test routes
var testGoodRoute = new RouteModel({
    title: "40",
    transport_type: "bus",
    cost: 20
});

//  Find route by number
var s_id_finder = function(title, callback) {
    RouteModel.findOne({title: title}, function(err, route) {
        if (err) {
            return callback(null, new Error("Find route error"));
        }
        if (!route) {
            return callback(null, new Error("Created route not find"));
        }
        return callback(route.s_id, null);
    });
};

// Work with test routes before and after starting the test
function createTestRoutes(done) {
    testGoodRoute.save(function (err) {
        done(err);
    });
}

function deleteTestRoutes(done) {
    RouteModel.findOneAndRemove({title: testGoodRoute.title}, function(err, route) {
        if (err) {
            return done(err);
        }
        if (!route) {
            return done(new Error('Route for deleting not found'));
        }
        done();
    });
}



// *************************************************************
//                          TESTS
// *************************************************************
// TODO: THIS IS NOT WORKS!
describe('Route management', function () {

    //after (function (done) { deleteTestRoutes(done); });

    describe('createRoute', function () {

        it('creating valid route', function (done) {
            routeManagement.createRoute(testGoodRoute.title, testGoodRoute.transport_type, testGoodRoute.cost ,function (err) {
                RouteModel.findOne({title: testGoodRoute.title}, function (err, route) {
                    if (err) throw "Error find route";
                    expect(route.title).to.equal(testGoodRoute.title);
                    expect(route.transport_type).to.equal(testGoodRoute.transport_type);
                    expect(route.cost).to.equal(testGoodRoute.cost);
                    expect(route).to.have.property('s_id');
                    expect(route.stations).to.be.a('Array');
                    done();
                });
            });
        });

    });

    // Getting all stations
    describe('getAllRoutes', function () {

        it('getting list of routes', function (done) {
            routeManagement.getAllRoutes(function (err, routes) {
                expect(err).to.equal(null);
                expect(routes).to.be.a('Array');
                expect(routes[0]).to.have.property('_id');
                expect(routes[0]).to.have.property('s_id');
                expect(routes[0]).to.have.property('title');
                expect(routes[0]).to.have.property('transport_type');
                expect(routes[0]).to.have.property('cost');
                expect(routes[0]).to.have.property('stations');
                RouteModel.count({}, function (err, count) {
                    if (err) throw 'Error count routes';
                    expect(routes).to.have.length(count);
                    done();
                });
            });
        });

    });


    describe('getRoute', function () {

        it('getting route', function (done) {
            s_id_finder(testGoodRoute.title, function(test_s_id, err) {
                if (err)
                    done(err);
                routeManagement.getRoute(test_s_id, function (err, route) {
                    expect(err).to.equal(null);
                    expect(route).to.have.property('_id');
                    expect(route.s_id).to.equal(test_s_id);
                    expect(route.title).to.equal(testGoodRoute.title);
                    expect(route.transport_type).to.equal(testGoodRoute.transport_type);
                    expect(route.cost).to.equal(testGoodRoute.cost);
                    expect(route.stations).to.be.a('Array');
                    done();
                });
            });
        });

    });

    describe('deleteRoute', function() {

        it('deleting route', function (done) {
            s_id_finder(testGoodRoute.title, function (test_s_id, err) {
                if (err)
                    done(err);
                routeManagement.deleteRoute(test_s_id, function (err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

    });


});
