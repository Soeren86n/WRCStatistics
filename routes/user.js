var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');


router.post('/', function (req, res, next) {
  var admin = req.body.email === 'Ice-eye@web.de';
  var user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    admin: admin
  });
  user.save(function (err, result) {
    if (err) {
      return res.status(500).json({
        summary: 'An Error occurred',
        detail: err.message,
        severity: 'error'
      });
    }
    res.status(201).json({
      message: 'User created',
      obj: result,
      notification: {
        summary: 'User created',
        detail: 'User ' + result.email + ' successfully created!',
        severity: 'success'
      }
    });
  })
});

router.post('/signin', function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).json({
        summary: 'An Error occurred',
        detail: err.message,
        severity: 'error'
      });
    }
    if (!user) {
      return res.status(401).json({
        summary: 'Login failed',
        detail: 'Invalid login credentials',
        severity: 'error'
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        summary: 'Login failed',
        detail: 'Invalid login credentials',
        severity: 'error'
      });
    }
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Login failed',
        detail:  'Account not enabled!',
        severity: 'error'
      });
    }
    var token = jwt.sign({ user: user }, 'secret', { expiresIn: 7200 });
    res.status(200).json({
      message: 'Successfully logged in',
      token: token,
      userId: user._id,
      notification: {
        summary: 'Sucessfully logged in',
        detail: 'User ' + user.email + ' successfully logged in!',
        severity: 'success'
      }
    });
  });
});

module.exports = router;
