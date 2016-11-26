
// ========================================
// Router for statistics API calls
// ========================================

var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');
var statisticsManager = require('../libs/statistics_manager');


// Getting all user notes
router.get('/statistics/:s_id/:r_id', auth().authenticate(), function (req, res) {
    statisticsManager.getStatistics(req.params.s_id, req.params.r_id, function(err, statistics) {
        if(err){
            res.json({success: false, error: err.message}).end();
            logger.warn('Getting statistics by '+res.user.login+' error: '+err.message);
        }
        else{
            res.json({success: true, statistics: statistics}).end();
            logger.info('User '+req.user.login+' got statistics');
        }
    })
});

module.exports = router;