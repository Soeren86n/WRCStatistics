var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  stagetimes: [{ type: Schema.Types.ObjectId, ref: 'Stagetime' }],
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Manufacturer', schema);