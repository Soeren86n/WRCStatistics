var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  position: { type: Number, required: true },
  meter: { type: Number, required: true },
  time: { type: String, required: true },
  meterpersecond: { type: String, required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  stage: { type: Schema.Types.ObjectId, ref: 'Stage' },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' }
});


module.exports = mongoose.model('Rallymeterdifference', schema);