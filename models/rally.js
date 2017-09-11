var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Country = require('./country');

var schema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  startdate: { type: String, required: true },
  enddate: { type: String, required: true },
  stages: [{ type: Schema.Types.ObjectId, ref: 'Stage' }],
  cars: [{ type: Schema.Types.ObjectId, ref: 'Rallycar' }]
});

schema.post('remove', function (rally) {
  Country.findById(rally.country, function (err, country) {
    country.rallys.pull(rally);
    country.save();
  });
});

module.exports = mongoose.model('Rally', schema);