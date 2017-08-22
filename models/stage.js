var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  name: { type: String, required: true },
  day: { type: Number, required: true },
  date: { type: String, required: true },
  cancelled: { type: Boolean, required: true },
  number: { type: Number, required: true },
  meter: { type: Number, required: true },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally' },
  stagetimes: [{ type: Schema.Types.ObjectId, ref: 'Stagetimes' }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Stage', schema);