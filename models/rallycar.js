var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  rally:  { type: Schema.Types.ObjectId, ref: 'Rally' }
});


module.exports = mongoose.model('Rallycar', schema);