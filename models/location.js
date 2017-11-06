var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var locationSchema = new Schema({
		_id: Number,
		name: String
})

locationSchema.plugin(autoIncrement.plugin, {model: 'location', field: '_id', startAt: 1, incrementBy: 1});


var locationModel = db.model('location', locationSchema);

module.exports = { locationModel: locationModel, locationSchema: locationSchema};
