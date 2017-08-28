var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortname: { type: String, required: true, unique: true }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Country', schema);