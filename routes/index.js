var express = require('express');
var router = express.Router();

var Location = require('../models/location').locationModel;
var Hotel = require('../models/hotel').hotelModel;

router.post('/', function(req, res, next) {
    var location = req.body.location;
    if (!location) {
        location = "서울";
    }
    console.log('_id=', location);
    Location.find({}, function(err, other) {
        var filter = {
            address: new RegExp(location, "i")
        };
        var options = {
            limit: 12,
        };
        Hotel.findRandom(filter, {}, options, function(err, results) {
            console.log(results);
            res.send({
                title: '호텔 추천 시스템',
                hotels: results,
                location: other,
                user: req.user
            });
        });
    });
});
/* GET home page. */
router.get('/', function(req, res, next) {
    var location = req.body.location;
    if (!location) {
        location = "서울";
    }
    console.log('_id=', location);
    Location.find({}, function(err, other) {
        var filter = {
            address: new RegExp(location, "i")
        };
        var options = {
            limit: 12,
        };
        Hotel.findRandom(filter, {}, options, function(err, results) {
            console.log(results);
            res.render('index', {
                title: '호텔 추천 시스템',
                hotels: results,
                location: other,
                user: req.user
            });
        });
    });
});

module.exports = router;
