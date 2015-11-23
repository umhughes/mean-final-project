// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var languageSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Language', languageSchema);