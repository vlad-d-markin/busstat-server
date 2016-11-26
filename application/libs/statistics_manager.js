
// ========================================
// Module for managing statistics objects
// ========================================

var StatisticsModel = require('./../models/statistics_model');
var StationModel = require('./../models/station_model');


var interval = 5;  // TODO: constants

var manager = {

    //
    handleNote : function(s_id, r_id, time, callback) {
        StatisticsModel.findOne({s_id: s_id, r_id: r_id}, function (err, statistics) {
            if(err) {
                return callback(err);
            }
            if(!statistics) {
                manager.createStatistics(s_id, r_id, function (err) {
                    if(err) {
                        return callback(err);
                    } else {
                        return manager.handleNote(s_id, r_id, time, callback);
                    }
                });
            } else {

                var t = new Date(time);
                var minutes = t.getHours()*60+t.getMinutes();
                if(t.getSeconds()>0) {
                    minutes++;
                }

                var intTime = new Date;
                intTime.setHours(23,55,0);
                for(var i=0; i<(minutes/5); i++) {
                    intTime.setMinutes(intTime.getMinutes()+5);
                }

                var tm = (intTime.getHours()<10?'0':'') + intTime.getHours() + ':'
                    + (intTime.getMinutes()<10?'0':'') + intTime.getMinutes();
                console.log("TIME="+tm);


                if(t.getDay() < 5) {
                    var index = statistics.weekdaysCount.findIndex(function (el) {
                        return el.time == tm;
                    });

                    statistics.weekdaysCount[index].count++;
                    statistics.save(function(err) {
                        return callback(err);
                    });
                } else if (t.getDay() < 6) {
                    var index = statistics.fridayCount.findIndex(function (el) {
                        return el.time == tm;
                    });

                    statistics.fridayCount[index].count++;
                    statistics.save(function(err) {
                        return callback(err);
                    });
                } else {
                    var index = statistics.weekendCount.findIndex(function (el) {
                        return el.time == tm;
                    });

                    statistics.weekendCount[index].count++;
                    statistics.save(function(err) {
                        return callback(err);
                    });
                }
            }

        });
    },

    //
    createStatistics : function(s_id, r_id, callback) {
        var intervalNum = (60*24) / 5;

        var intTime = new Date;
        intTime.setHours(23,55,0);

        var new_statistics = new StatisticsModel({
            r_id: r_id,
            s_id: s_id
        });


        for(var i=0; i<intervalNum; i++) {
            intTime.setMinutes(intTime.getMinutes()+5);

            var tm = (intTime.getHours()<10?'0':'') + intTime.getHours() + ':'
                + (intTime.getMinutes()<10?'0':'') + intTime.getMinutes();

            new_statistics.weekdaysCount.push({ time: tm });
            new_statistics.fridayCount.push({ time: tm });
            new_statistics.weekendCount.push({ time: tm });
            new_statistics.weekdaysFreq.push({ time: tm });
            new_statistics.fridayFreq.push({ time: tm });
            new_statistics.weekendFreq.push({ time: tm });

        }

        new_statistics.save(function (err) {
            if(err) {
                return callback(err);
            }
            return callback(null);
        });
    },

//not tested, only wrote
    calculateStatistics : function (s_id,r_id,callback) {
        StatisticsModel.findOne({s_id: s_id, r_id: r_id}, function (err, statistics) {
            if (err) {
                return callback(err);
            }
            if (!statistics) {
                return callback(new Error("Statistics not found!"));
            }

            var countOfWeekNotes = 0;
            statistics.weekdaysCount.forEach(function (el, i) {
                countOfWeekNotes = countOfWeekNotes + el.count;
            });

            var countOfFridayNotes = 0;
            statistics.fridayCount.forEach(function (el, i) {
                countOfFridayNotes = countOfFridayNotes + el.count;
            });

            var countOfWeekendNotes = 0;
            statistics.weekendCount.forEach(function (el, i) {
                countOfWeekendNotes = countOfWeekendNotes + el.count;
            });
                console.log("COUNT!!!: "+countOfWeekNotes);
            statistics.weekdaysCount.forEach(function (el, i) {
                statistics.weekdaysFreq[i].count = el.count/countOfWeekNotes;
            });

            statistics.fridayCount.forEach(function (el, i) {
                statistics.fridayFreq[i].count = el.count/countOfFridayNotes;
            });

            statistics.weekendCount.forEach(function (el, i) {
                statistics.weekendFreq[i].count = el.count/countOfWeekendNotes;
            });

            statistics.save(function (err) {
                if(err) {
                    return callback(err);
                }
                return callback(null);
            });
        });
    },

    getStatistics : function (s_id, r_id, callback) {
        StatisticsModel.find({s_id: s_id, r_id: r_id},{weekdaysFreq: true, fridayFreq: true, weekendFreq: true},function(err, statistics) {
            if(err) {
                return callback(err, null);
            } else {
                return callback(null,statistics);
            }
        });
    },
//TODO stations
    updateStatistics : function (callback) {
        StationModel.find({},{},function(err,stations){
            if(err){
                return callback(err);
            }
            stations.forEach(function (el,i) {
                el.stations.forEach(function (route,j) {
                    manager.calculateStatistics(el.s_id, route, function (err) {
                        if(err){
                            return callback(err);
                        }
                    })
                })
            })
        })
        return callback(null);
    }

};

module.exports = manager;