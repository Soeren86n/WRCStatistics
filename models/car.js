var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  startnumber: { type: Number, required: true },
  Driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  Codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' },
  Manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally' }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Car', schema);