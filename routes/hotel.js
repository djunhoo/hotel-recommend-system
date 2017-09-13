var express = require('express');
var router = express.Router();
var Hotel = require('../models/hotel').hotelModel;

/* GET home page. */
router.get('/', function(req, res, next) {
	Hotel.find({},'-__v', function(err, docs) {
		res.json({
			hotel: docs
		})
	})
});

module.exports = router;
