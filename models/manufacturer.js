var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});


module.exports = mongoose.model('Manufacturer', schema);