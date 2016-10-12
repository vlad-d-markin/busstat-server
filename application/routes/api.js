var express = require('express');
var router = express.Router();
var logger = require('../libs/logger')(module);
var auth = require('../libs/auth');


router.get('/test', auth().authenticate(), function (req, res) {
    res.json({ success: true, message: "Test api call", user: req.user}).end();
});


module.exports = router;