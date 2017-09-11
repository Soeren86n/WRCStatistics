var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country' }
});


module.exports = mongoose.model('Driver', schema);