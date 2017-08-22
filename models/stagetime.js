var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  stage: { type: Schema.Types.ObjectId, ref: 'Stage' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  time: { type: String, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Car' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' }
});


module.exports = mongoose.model('Stagetimes', schema);