var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var User = require('../models/user');
var Rally = require('../models/rally');
var Stage = require('../models/stage');
var Manufacturer = require('../models/manufacturer');

router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'secret', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        summary: 'Not Authenticated!',
        detail: err.message,
        severity: 'error'
      });
    }
    next();
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

router.post('/insertrally', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Country.findById(req.body.country, function (err, country) {
      if (!country) {
        return res.status(500).json({
          summary: 'No Country Found!',
          detail: 'Country not found',
          severity: 'error'
        });
      }
      var rally = new Rally({
        name: req.body.name,
        country: country,
        startdate: req.body.startdate,
        enddate: req.body.enddate
      });
      rally.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        country.rallys.push(result._id);
        country.save();
        res.status(201).json({
          message: 'Rally created',
          obj: result,
          notification: {
            summary: 'Rally created',
            detail: 'Rally ' + result.name + ' successfully created!',
            severity: 'success'
          }
        });
      })
    });
  });
});
router.patch('/updaterally/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Rally.findById(req.params.id, function (err, rally) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!rally) {
        return res.status(500).json({
          summary: 'No Rally Found!',
          detail: 'Rally not found',
          severity: 'error'
        });
      }
      Country.findById(rally.country, function (err, country) {
        country.rallys.pull(rally);
        country.save();
      });
      Country.findById(req.body.country, function (err, country) {
        if (!country) {
          return res.status(500).json({
            summary: 'No Country for Rally Found!',
            detail: 'Rally Country not found',
            severity: 'error'
          });
        }
        country.rallys.push(rally);
        country.save();
      });
      rally.name = req.body.name;
      rally.enddate = req.body.enddate;
      rally.startdate = req.body.startdate;
      rally.country = req.body.country;
      rally.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Rally',
          obj: result,
          notification: {
            summary: 'Rally Sucessfully updated',
            detail: 'Rally ' + rally.name + ' successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});
router.delete('/deleterally/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Rally.findById(req.params.id, function (err, rally) {
      if (err) {
        return res.status(500).json({
          summary: 'An Error occurred',
          detail: err.message,
          severity: 'error'
        });
      }
      if (!rally) {
        return res.status(500).json({
          summary: 'No Rally Found!',
          detail: 'Rally not found',
          severity: 'error'
        });
      }
      rally.remove(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Rally deleted',
          obj: result,
          notification: {
            summary: 'Rally deleted',
            detail: 'Rally ' + result.name + ' successfully deleted!',
            severity: 'success'
          }
        });
      });
    });
  });
});

router.post('/insertstage', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Rally.findById(req.body.rally, function (err, rally) {
      if (!rally) {
        return res.status(500).json({
          summary: 'No Rally Found!',
          detail: 'Rally not found',
          severity: 'error'
        });
      }
      var stage = new Stage({
        name: req.body.name,
        day: req.body.day,
        date: req.body.date,
        cancelled: req.body.cancelled,
        stagenumber: req.body.stagenumber,
        meter: req.body.meter,
        rally: rally
      });
      stage.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        rally.stages.push(result._id);
        rally.save();
        res.status(201).json({
          message: 'Stage created',
          obj: result,
          notification: {
            summary: 'Stage created',
            detail: 'Stage ' + result.name + ' successfully created!',
            severity: 'success'
          }
        });
      })
    });
  });
});
router.patch('/updatestage/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Stage.findById(req.params.id, function (err, stage) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!stage) {
        return res.status(500).json({
          summary: 'No Stage Found!',
          detail: 'Stage not found',
          severity: 'error'
        });
      }
      Rally.findById(stage.rally, function (err, stagerally) {
        stagerally.stages.pull(stage);
        stagerally.save();
      });
      Rally.findById(req.body.rally, function (err, stagerally) {
        if (!stagerally) {
          return res.status(500).json({
            summary: 'No Rally for Stage Found!',
            detail: 'Stage Rally not found',
            severity: 'error'
          });
        }
        stagerally.stages.push(stage);
        stagerally.save();
      });
      stage.rally = req.body.rally;
      stage.name = req.body.name;
      stage.date = req.body.date;
      stage.day = req.body.day;
      stage.cancelled = req.body.cancelled;
      stage.powerstage = req.body.powerstage;
      stage.stagenumber = req.body.stagenumber;
      stage.meter = req.body.meter;
      stage.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Stage',
          obj: result,
          notification: {
            summary: 'Stage Sucessfully updated',
            detail: 'Stage ' + stage.name + ' successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});
router.delete('/deletestage/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Stage.findById(req.params.id, function (err, stage) {
      if (err) {
        return res.status(500).json({
          summary: 'An Error occurred',
          detail: err.message,
          severity: 'error'
        });
      }
      if (!stage) {
        return res.status(500).json({
          summary: 'No Stage Found!',
          detail: 'Stage not found',
          severity: 'error'
        });
      }
      stage.remove(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Stage deleted',
          obj: result,
          notification: {
            summary: 'Stage deleted',
            detail: 'Stage ' + result.name + ' successfully deleted!',
            severity: 'success'
          }
        });
      });
    });
  });
});

router.post('/insertmanufacturer', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Country.findById(req.body.country, function (err, country) {
      if (!country) {
        return res.status(500).json({
          summary: 'No Country Found!',
          detail: 'Country not found',
          severity: 'error'
        });
      }
      console.log(country);
      var manu = new Manufacturer({
        name: req.body.name,
        country: country
      });
      manu.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        res.status(201).json({
          message: 'Manufacturer created',
          obj: result,
          notification: {
            summary: 'Manufacturer created',
            detail: 'Manufacturer ' + result.name + ' successfully created!',
            severity: 'success'
          }
        });
      })
    });
  });
});
router.patch('/updatemanufacturer/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Manufacturer.findById(req.params.id, function (err, manu) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!manu) {
        return res.status(500).json({
          summary: 'No Manufacturer Found!',
          detail: 'Manufacturer not found',
          severity: 'error'
        });
      }
      manu.name = req.body.name;
      manu.country = req.body.country;
      manu.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Manufacturer',
          obj: result,
          notification: {
            summary: 'Manufacturer Sucessfully updated',
            detail: 'Manufacturer ' + manu.name + ' successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});

module.exports = router;
