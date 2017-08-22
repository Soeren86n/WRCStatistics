var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  stage: { type: Schema.Types.ObjectId, ref: 'Stage' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  time: { type: String, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Car' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Stagetimes', schema);