var express = require('express');
var router = express.Router();

var Location = require('../models/location').locationModel;
var Hotel = require('../models/hotel').hotelModel;

router.get('/search', function(req, res, next) {
    res.render('hotel/search', {
        title: '호텔 검색',
        hotel: null,
        user: req.user
    });
});

router.post('/search', function(req, res, next) {
    console.log('value=', req.body.name);
    console.log('type=', req.body.type);
    var type = req.body.type;
    var name = req.body.name;
    if(type == "" || !type) {
        type = "name"
    }
    if( name == "" ) {
        name = "wefij23f289f289524m2lkj9wefm23o";
    }
    var options;
    if(type == "name") {
        options = {
            name: new RegExp(name, "i")
        }
    } else {
        options = {
            address: new RegExp(name, "i")
        }
    }
    Hotel.find({name: new RegExp(name, "i")})
        .limit(10)
        .exec(function(err, docs) {
            if(err) console.log('err=', err);
            console.log('results=', docs);
            res.send({
                title: '웹툰 검색',
                hotels: docs,
                user: req.user
            });
        });
});

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
            limit: 16,
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
