var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var Rally = require('../models/rally');
var Stage = require('../models/stage');
var User = require('../models/user');

router.get('/country', function (req, res, next) {
  Country.find()
      .exec(function (err, country) {
        if (err) {
          return res.status(500).json({
            title: 'An error occurred',
            error: err
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
          return res.status(500).json({
            title: 'An error occurred',
            error: err
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
            title: 'An error occurred',
            error: err
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});
router.get('/rally/stage/:id', function (req, res, next) {
  // Hier weitermachen!
  Stage.find({ rally: req.params.id })
      .populate('rally')
      .exec(function (err, stage) {
        if (err) {
          return res.status(500).json({
            title: 'An error occurred',
            error: err
          });
        }
        res.status(200).json({
          message: 'Success',
          obj: stage
        });
      });
});

module.exports = router;
