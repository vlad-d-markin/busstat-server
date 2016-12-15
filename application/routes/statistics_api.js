
// ========================================
// Router for statistics API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var statisticsManager = require('../libs/statistics_manager');


// Getting all user notes auth().authenticate(), +res.user.login+
router.get('/statistics/:s_id/:r_id', auth().authenticate(), function (req, res) {
    statisticsManager.getStatistics(req.params.s_id, req.params.r_id, function(err, statistics) {
        if(err){
            res.json({success: false, error: err.message});
            logger.warn('Getting statistics by '+req.user.login+' error: '+err.message);
        }
        else{
            var weekdaysFreq = statistics[0].weekdaysFreq;
            weekdaysFreq = weekdaysFreq.map(function (f) {
                return { time: f.time, count: f.count };
            });

            var weekendFreq = statistics[0].weekendFreq;
            weekendFreq = weekendFreq.map(function (f) {
                return { time: f.time, count: f.count };
            });

            var fridayFreq = statistics[0].fridayFreq;
            fridayFreq = fridayFreq.map(function (f) {
                return { time: f.time, count: f.count };
            });

            res.json({success: true, statistics: {
                weekdaysFreq: weekdaysFreq,
                weekendFreq: weekendFreq,
                fridayFreq: fridayFreq
            }});
            logger.info('User '+req.user.login+' got statistics');
        }
    })
});

module.exports = router;