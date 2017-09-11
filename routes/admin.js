var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Country = require('../models/country');
var User = require('../models/user');
var Rally = require('../models/rally');
var Stage = require('../models/stage');
var Manufacturer = require('../models/manufacturer');
var Driver = require('../models/driver');
var Codriver = require('../models/codriver');
var Car = require('../models/car');
var Rallycar = require('../models/rallycar');
var Stagetime = require('../models/stagetime');

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

router.post('/insertdriver', function (req, res, next) {
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
      var driver = new Driver({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: country
      });
      driver.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        country.drivers.push(result._id);
        country.save();
        res.status(201).json({
          message: 'Driver created',
          obj: result,
          notification: {
            summary: 'Driver created',
            detail: 'Driver ' + result.firstname + ' ' + result.lastname + ' successfully created!',
            severity: 'success'
          }
        });
      })
    });
  });
});
router.patch('/updatedriver/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Driver.findById(req.params.id, function (err, driver) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!driver) {
        return res.status(500).json({
          summary: 'No Driver Found!',
          detail: 'Driver not found',
          severity: 'error'
        });
      }
      Country.findById(driver.country, function (err, country) {
        country.drivers.pull(driver);
        country.save();
      });
      Country.findById(req.body.country, function (err, country) {
        if (!country) {
          return res.status(500).json({
            summary: 'No Country for Driver Found!',
            detail: 'Driver Country not found',
            severity: 'error'
          });
        }
        country.drivers.push(driver);
        country.save();
      });
      driver.firstname = req.body.firstname;
      driver.lastname = req.body.lastname;
      driver.country = req.body.country;
      driver.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Driver',
          obj: result,
          notification: {
            summary: 'Driver Sucessfully updated',
            detail: 'Driver ' + driver.lastname + ' successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});

router.post('/insertcodriver', function (req, res, next) {
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
      var driver = new Codriver({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: country
      });
      driver.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An Error occurred',
            detail: err.message,
            severity: 'error'
          });
        }
        country.codrivers.push(result._id);
        country.save();
        res.status(201).json({
          message: 'Codriver created',
          obj: result,
          notification: {
            summary: 'Codriver created',
            detail: 'Codriver ' + result.firstname + ' ' + result.lastname + ' successfully created!',
            severity: 'success'
          }
        });
      })
    });
  });
});
router.patch('/updatecodriver/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Codriver.findById(req.params.id, function (err, driver) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!driver) {
        return res.status(500).json({
          summary: 'No Codriver Found!',
          detail: 'Codriver not found',
          severity: 'error'
        });
      }
      Country.findById(driver.country, function (err, country) {
        country.codrivers.pull(driver);
        country.save();
      });
      Country.findById(req.body.country, function (err, country) {
        if (!country) {
          return res.status(500).json({
            summary: 'No Country for CoDriver Found!',
            detail: 'Codriver Country not found',
            severity: 'error'
          });
        }
        country.codrivers.push(driver);
        country.save();
      });
      driver.firstname = req.body.firstname;
      driver.lastname = req.body.lastname;
      driver.country = req.body.country;
      driver.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Codriver',
          obj: result,
          notification: {
            summary: 'Codriver Sucessfully updated',
            detail: 'Codriver ' + driver.lastname + ' successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});

router.post('/insertcar', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Driver.findById(req.body.driver, function (err, driver) {
      if (!driver) {
        return res.status(500).json({
          summary: 'No Driver Found!',
          detail: 'Driver not found',
          severity: 'error'
        });
      }
      Codriver.findById(req.body.codriver, function (err, codriver) {
        if (!codriver) {
          return res.status(500).json({
            summary: 'No Codriver Found!',
            detail: 'Codriver not found',
            severity: 'error'
          });
        }
        Manufacturer.findById(req.body.manufacturer, function (err, manufacturer) {
          if (!manufacturer) {
            return res.status(500).json({
              summary: 'No Manufacturer Found!',
              detail: 'Manufacturer not found',
              severity: 'error'
            });
          }
          var car = new Car({
            startnumber: req.body.startnumber,
            year: req.body.year,
            driver: driver,
            codriver: codriver,
            manufacturer: manufacturer,
          });
          car.save(function (err, result) {
            if (err) {
              return res.status(500).json({
                summary: 'An Error occurred',
                detail: err.message,
                severity: 'error'
              });
            }
            res.status(201).json({
              message: 'Car created',
              obj: result,
              notification: {
                summary: 'Car created',
                detail: 'Car ' + manufacturer.name + ' with Startnumber ' + result.startnumber + ' successfully created!',
                severity: 'success'
              }
            });
          })
        });
      });
    });
  });
});
router.patch('/updatecar/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    Car.findById(req.params.id, function (err, car) {
      if (err) {
        return res.status(500).json({
          summary: 'An error occurred',
          detail: err,
          severity: 'error'
        });
      }
      if (!car) {
        return res.status(500).json({
          summary: 'No Car Found!',
          detail: 'Car not found',
          severity: 'error'
        });
      }
      Driver.findById(req.body.driver, function (err, driver) {
        if (!driver) {
          return res.status(500).json({
            summary: 'No Driver for Car Found!',
            detail: 'Car Driver not found',
            severity: 'error'
          });
        }
      });
      Codriver.findById(req.body.codriver, function (err, codriver) {
        if (!codriver) {
          return res.status(500).json({
            summary: 'No Codriver for Car Found!',
            detail: 'Car Coriver not found',
            severity: 'error'
          });
        }
      });
      Manufacturer.findById(req.body.manufacturer, function (err, manufacturer) {
        if (!manufacturer) {
          return res.status(500).json({
            summary: 'No Manufacturer for Car Found!',
            detail: 'Car manufacturer not found',
            severity: 'error'
          });
        }
      });
      car.startnumber = req.body.startnumber;
      car.year = req.body.year;
      car.driver = req.body.driver;
      car.codriver = req.body.codriver;
      car.manufacturer = req.body.manufacturer;
      car.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            summary: 'An error occurred',
            detail: err,
            severity: 'error'
          });
        }
        res.status(200).json({
          message: 'Updated Car',
          obj: result,
          notification: {
            summary: 'Car Sucessfully updated',
            detail: 'Car successfully updated!',
            severity: 'success'
          }
        });
      });
    });
  });
});

router.post('/insertrallycar', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }

    for (var key in req.body) {
      Rally.findById(req.body[key].rally, function (err, rally) {
        if (!rally) {
          return res.status(500).json({
            summary: 'No Rally Found!',
            detail: 'Rally not found',
            severity: 'error'
          });
        }
        Car.findById(req.body[key].carID, function (err, car) {
          if (!car) {
            return res.status(500).json({
              summary: 'No car Found!',
              detail: 'Car not found',
              severity: 'error'
            });
          }

          var rallycar = new Rallycar({
            car: car,
            rally: rally
          });
          rallycar.save(function (err, result) {
            rally.cars.push(result);
            if (err) {
              return res.status(500).json({
                summary: 'An Error occurred',
                detail: err.message,
                severity: 'error'
              });
            }
          })
        });
      });
    }
    res.status(201).json({
      message: 'Rallycars created',
      notification: {
        summary: 'Rallycars created',
        detail: 'Cars successfully created!',
        severity: 'success'
      }
    });
  });
});

router.post('/insertstagetime', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function (err, user) {
    if (!user.admin) {
      return res.status(401).json({
        summary: 'Not Authorised',
        detail: 'User ' + user.email + ' is not Authorised',
        severity: 'error'
      });
    }
    for (var key in req.body) {
      Rally.findById(req.body[key].rally, function (err, rally) {
        if (!rally) {
          return res.status(500).json({
            summary: 'No Rally Found!',
            detail: 'Rally not found',
            severity: 'error'
          });
        }
        Car.findById(req.body[key].car, function (err, car) {
          if (!car) {
            return res.status(500).json({
              summary: 'No car Found!',
              detail: 'Car not found',
              severity: 'error'
            });
          }
          Stage.findById(req.body[key].stage, function (err, stage) {
            if (!stage) {
              return res.status(500).json({
                summary: 'No Stage Found!',
                detail: 'Stage not found',
                severity: 'error'
              });
            }
            Manufacturer.findById(req.body[key].manufacturer, function (err, manufacturer) {
              if (!manufacturer) {
                return res.status(500).json({
                  summary: 'No Stage Found!',
                  detail: 'Stage not found',
                  severity: 'error'
                });
              }
              Driver.findById(req.body[key].driver, function (err, driver) {
                if (!driver) {
                  return res.status(500).json({
                    summary: 'No Stage Found!',
                    detail: 'Stage not found',
                    severity: 'error'
                  });
                }
                Codriver.findById(req.body[key].codriver, function (err, codriver) {
                  if (!codriver) {
                    return res.status(500).json({
                      summary: 'No Stage Found!',
                      detail: 'Stage not found',
                      severity: 'error'
                    });
                  }

                  var stagetime = new Stagetime({
                    stage: stage,
                    rally: rally,
                    car: car,
                    time: req.body[key].time,
                    position: req.body[key].position,
                    manufacturer: manufacturer,
                    driver: driver,
                    codriver: codriver
                  });
                  stagetime.save(function (err, result) {
                    rally.stagetimes.push(result);
                    rally.save();
                    if (err) {
                      return res.status(500).json({
                        summary: 'An Error occurred',
                        detail: err.message,
                        severity: 'error'
                      });
                    }
                  })
                });
              });
            });
          });
        });
      });
    }
    res.status(201).json({
      message: 'Stagetime insert',
      notification: {
        summary: 'Stagetime created',
        detail: 'Stagetime successfully created!',
        severity: 'success'
      }
    });
  });
});

module.exports = router;
