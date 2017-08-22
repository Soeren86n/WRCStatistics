var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortname: { type: String, required: true, unique: true },
  drivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
  codrivers: [{ type: Schema.Types.ObjectId, ref: 'Codriver' }],
  manufacturers: [{ type: Schema.Types.ObjectId, ref: 'Manufacturer' }],
  rallys: [{ type: Schema.Types.ObjectId, ref: 'Rally' }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Country', schema);