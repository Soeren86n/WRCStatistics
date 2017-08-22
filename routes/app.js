var express = require('express');
var router = express.Router();
var Car = require('../models/car');
var Codriver = require('../models/codriver');
var Country = require('../models/country');
var Driver = require('../models/driver');
var Manufacturer = require('../models/manufacturer');
var Rally = require('../models/rally');
var Stage = require('../models/stage');
var Stagetime = require('../models/stagetime');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
