var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  name: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  startdate: { type: String, required: true },
  enddate: { type: String, required: true }
});


module.exports = mongoose.model('Rally', schema);