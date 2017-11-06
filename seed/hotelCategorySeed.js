// hotelCategorySeed.js
var db = require('../models/db');
var CategoryModel = require('../models/hotelCategory').hotelCategoryModel;
var mongoose = require('mongoose');

var category = [
	new CategoryModel({
		name: "호텔"
	}),
	new CategoryModel({
		name: "모텔"
	}),
	new CategoryModel({
		name: "펜션"
	})
];
console.log('category=', category)
var done = 0;
for (var i=0; i<category.length; i++) {
	category[i].save(function(err, result){
		console.log('result=', result);
		done++;
		if(done == category.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
