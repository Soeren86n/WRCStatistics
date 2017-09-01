var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Rally = require('./rally');

var schema = new Schema({
  name: { type: String, required: true },
  day: { type: Number, required: true },
  date: { type: String, required: true },
  cancelled: { type: Boolean, required: true },
  stagenumber: { type: Number, required: true },
  meter: { type: Number, required: true },
  rally: { type: Schema.Types.ObjectId, ref: 'Rally' },
  stagetimes: [{ type: Schema.Types.ObjectId, ref: 'Stagetimes' }]
});

schema.post('remove', function (stage) {
  Rally.findById(stage.rally, function (err, rally) {
    rally.stages.pull(rally);
    rally.save();
  });
});

module.exports = mongoose.model('Stage', schema);