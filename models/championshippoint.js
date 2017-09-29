var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  points: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally'  },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' }
});


module.exports = mongoose.model('Championshippoint', schema);