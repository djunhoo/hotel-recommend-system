// hotel.js
var mongoose = require('mongoose');
var db = require('./db');

var hotelCategory = require('./hotelCategory').hotelCategorySchema;
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var hotelSchema = new Schema({
	name: String,
	address: String,
	mainImg: String,
	roomImg: {
	  type:	[String],
	  validate: [arrayLimit, '{PATH} exceeds the limit of 5']
	},
	phonenumber: String,
	point: Number,
	category: String
});

function arrayLimit(val) {
	return val.length <= 5;
}

hotelSchema.index({
    name: 'text',
    address: 'text',
    mainImg: 'text'
});

hotelSchema.plugin(autoIncrement.plugin, {model: 'hotel', field: '_id', startAt:1, incrementBy: 1});
hotelSchema.plugin(random);

var hotelModel = db.model('hotel', hotelSchema);

module.exports = {hotelModel: hotelModel, hotelSchema: hotelSchema};
