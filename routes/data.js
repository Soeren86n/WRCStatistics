var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var Rally = require('../models/rally');
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


module.exports = router;
