// hotelCategory.js
var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var hotelCategorySchema = new Schema({
	_id: Number,
	name: String
})

hotelCategorySchema.plugin(autoIncrement.plugin, {model: 'hotelCategory', field: '_id', startAt: 1, incrementBy: 1});


var hotelCategoryModel = db.model('hotelCategory', hotelCategorySchema);

module.exports = { hotelCategoryModel: hotelCategoryModel, hotelCategorySchema: hotelCategorySchema};
