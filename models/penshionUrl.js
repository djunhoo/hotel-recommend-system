// penshionUrl.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;

var urlSchema = new Schema({
    url: String,
    category: String,
	mainImg: String
});

var urlModel = db.model('pensionurl', urlSchema);

module.exports = {
    urlModel: urlModel,
    urlSchema: urlSchema
};
