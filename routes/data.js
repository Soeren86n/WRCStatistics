var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var Rally = require('../models/rally');
var Stage = require('../models/stage');
var User = require('../models/user');
var Manufacturer = require('../models/manufacturer');
var Driver = require('../models/driver');
var Codriver = require('../models/codriver');
var Car = require('../models/car');
var Rallycar = require('../models/rallycar');
var Stagetime = require('../models/stagetime');
var Overalltime = require('../models/overalltime');
var Rallymeterdifference = require('../models/rallymeterdifference');

router.get('/country', function (req, res, next) {
  Country.find()
      .exec(function (err, country) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: country
        });
      });
});
router.get('/rally', function (req, res, next) {
  Rally.find()
      .populate('country')
      .exec(function (err, rally) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: rally
        });
      });
});
router.get('/stage', function (req, res, next) {
  Stage.find()
      .populate('rally')
      .exec(function (err, stage) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});
router.get('/rally/stage/:id', function (req, res, next) {
  Stage.find({ rally: req.params.id })
      .populate('rally')
      .sort({ stagenumber: 1 })
      .exec(function (err, stage) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});
router.get('/manufacturer', function (req, res, next) {
  Manufacturer.find()
      .populate('country')
      .exec(function (err, manu) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: manu
        });
      });
});
router.get('/driver', function (req, res, next) {
  Driver.find()
      .populate('country')
      .exec(function (err, driver) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: driver
        });
      });
});
router.get('/codriver', function (req, res, next) {
  Codriver.find()
      .populate('country')
      .exec(function (err, driver) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: driver
        });
      });
});
router.get('/car', function (req, res, next) {
  Car.find()
      .populate('driver')
      .populate('codriver')
      .populate('manufacturer')
      .sort({ year: 1 })
      .sort({ startnumber: 1 })
      .exec(function (err, car) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: car
        });
      });
});
router.get('/car/year/:id', function (req, res, next) {
  Car.find({ year: req.params.id })
      .populate('driver')
      .populate('codriver')
      .populate('manufacturer')
      .sort({ startnumber: 1 })
      .exec(function (err, car) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: car
        });
      });
});
router.get('/rallycar/:id', function (req, res, next) {
  Rallycar.find({ rally: req.params.id })
      .populate('rally')
      .populate({
        path: 'car',
        populate: [{ path: 'driver' }, { path: 'codriver' }, { path: 'manufacturer' }]
      })
      .exec(function (err, rallycar) {
        Rally.findById(req.params.id, function (err, rally) {
          rally.cars = rallycar;
          rally.save();
        });
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: rallycar
        });
      });
});
router.get('/stagetimes/:id', function (req, res, next) {
  Stagetime.find({ stage: req.params.id })
      .populate('rally')
      .populate('stage')
      .populate('car')
      .populate('manufacturer')
      .populate('driver')
      .populate('codriver')
      .exec(function (err, stagetime) {
        Stage.findById(req.params.id, function (err, stage) {
          stage.stagetimes = stagetime;
          stage.save();
        });
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stagetime
        });
      });
});

router.get('/overalltimes/:id', function (req, res, next) {
  Overalltime.find({ stage: req.params.id })
      .populate('rally')
      .populate('stage')
      .populate('car')
      .populate('manufacturer')
      .populate('driver')
      .populate('codriver')
      .exec(function (err, stagetime) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stagetime
        });
      });
});

router.post('/positionhistory/:id', function (req, res, next) {
  var id = [];
  for (key in req.body) {
    id.push(req.body[key].carObj.driver);
  }
  Overalltime.find({ rally: req.params.id, driver: { $in: id } })
      .populate('driver')
      .populate('stage')
      .sort({ stage: 1 })
      .sort({ position: 1 })
      .select({ position: 1, driver: 1, stage: 1, time: 1 })
      .exec(function (err, stagetime) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stagetime
        });
      });
});

router.post('/rallymeterdifference/:id', function (req, res, next) {
  var id = [];
  for (key in req.body) {
    id.push(req.body[key].carObj.driver);
  }
  Rallymeterdifference.find({ rally: req.params.id, driver: { $in: id } })
      .populate('driver')
      .populate('stage')
      .sort({ meterpersecond: -1 })
      .select({ meterpersecond: 1, driver: 1, stage: 1, time: 1, position: 1, meter: 1, rally: 1, car: 1 })
      .exec(function (err, stagetime) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stagetime
        });
      });
});
router.get('/stagewins', function (req, res, next) {
  Stagetime.find({ 'position': 1 })
      .populate('rally')
      .populate('stage')
      .populate('car')
      .populate('manufacturer')
      .populate('driver')
      .populate('codriver')
      .exec(function (err, stage) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});

router.get('/rallywins', function (req, res, next) {
  Overalltime.find({ 'position': 1 })
      .populate({
        path: 'stage',
        match: {
          powerstage: true
        }
      })
      .populate('rally')
      .populate('car')
      .populate('manufacturer')
      .populate('driver')
      .populate('codriver')
      .exec(function (err, stage) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        stage = stage.filter(function(stage) {
          return stage.stage;
        });
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});

module.exports = router;
