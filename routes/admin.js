var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var User = require('../models/user');

router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'secret', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        summary: 'Not Authenticated!',
        detail: err,
        severity: 'error'
      });
    }
    next();
  });
});


router.patch('/updatecountry/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Country.findById(req.params.id, function (err, country) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!country) {
        return res.status(500).json({
          summary: 'No Country Found!',
          detail: 'Country not found',
          severity: 'error'
        });
      }
      country.shortname = req.body.shortname;
      country.name = req.body.name;
      country.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated message',
          obj: result,
          notification: {
            summary: 'Country Sucessfully updated',
            detail: 'Country ' + country.name + ' (' + country.shortname + ') successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});


router.post('/insertcountry', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    var country = new Country({
      shortname: req.body.shortname,
      name: req.body.name
    });
    country.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          summary: 'An Error occurred',
          detail: err.message,
          severity: 'error'
        });
      }
      res.status(201).json({
        message: 'Country created',
        obj: result,
        notification: {
          summary: 'Country created',
          detail: 'Country ' + result.name + ' successfully created!',
          severity: 'success'
        }
      });
    })

  });
});

module.exports = router;
