var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  startnumber: { type: Number, required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  codriver: { type: Schema.Types.ObjectId, ref: 'Codriver' },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' }
});


module.exports = mongoose.model('Car', schema);