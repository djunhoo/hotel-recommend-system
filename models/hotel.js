// hotel.js
var mongoose = require('mongoose');
var db = require('./db');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var hotelSchema = new Schema({
	name: String,
	address: String,
	img_url: {
	  type:	[String],
	  validate: [arrayLimit, '{PATH} exceeds the limit of 5']
	},
	phonenumber: String
});

function arrayLimit(val) {
	return val.length <= 5;
}

hotelSchema.plugin(autoIncrement.plugin, {model: 'hotel', field: '_id', startAt:1, incrementBy: 1});

var hotelModel = db.model('hotel', hotelSchema);

module.exports = {hotelModel: hotelModel, hotelSchema: hotelSchema};