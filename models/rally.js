var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  startdate: { type: String, required: true },
  enddate: { type: String, required: true },
  stages: [{ type: Schema.Types.ObjectId, ref: 'Stage' }],
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Rally', schema);