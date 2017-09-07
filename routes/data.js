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
module.exports = router;
