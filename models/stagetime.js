var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  stage: { type: Schema.Types.ObjectId, ref: 'Stage' },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  time: { type: String, required: true },
  position: { type: String, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' }
});


module.exports = mongoose.model('Stagetime', schema);