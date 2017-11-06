// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mongoose = require('mongoose');
var Hotel = require('../models/hotel').hotelModel;
var Url = require('../models/url').urlModel;


Url.find({
    category: "모텔"
}, function(err, urls) {
    urls.forEach(function(url) {
        var options = {
            url: url.url,
            encoding: 'binary'
        };
        request(options, function(err, response, body) {

            if (err) return console.log('err', err);
            try {
                var strContents = iconv.decode(body, 'utf-8');
                var $ = cheerio.load(strContents);
                var strName = $('.info').find('h2')[0].children;
                var strAddress = $('.address')[0];
                var strimage = $('.swiper-wrapper').find('img')
                var strlength = $('.swiper-wrapper').find('img').length;
                var strPoint = $('.score_cnt').find('span')[0].children[0].data;
                //var strPhoneNumber = $('.call')[0].attribs.href.split(':')[1];
            } catch (err) {
                console.log('err=', err);
                return;
            }


            Hotel.findOne({
                name: strName[0].data
            }, function(err, hotel) {
                if (!hotel) {
                    var myHotel = new Hotel();
                    myHotel.name = strName[0].data;
                    myHotel.address = strAddress.children[0].data;
                    myHotel.mainImg = url.mainImg;
                    myHotel.category = url.category;
                    myHotel.point = strPoint;
                    // myHotel.phonenumber = strPhoneNumber
                    if (strlength > 5) {
                        for (var i = 0; i < 5; i++) {
                            var roomImg = strimage[i].attribs['data-src']
                            while (roomImg.charAt(0) === '/') {
                                roomImg = roomImg.substr(1);
                            }
                            while (roomImg.charAt(0) === '/') {
                                roomImg = roomImg.substr(1);
                            }
                            myHotel.roomImg.push(roomImg);
                        }
                    } else {
                        for (var i = 0; i < strlength; i++) {
                            var roomImg = strimage[i].attribs['data-src']
                            while (roomImg.charAt(0) === '/') {
                                roomImg = roomImg.substr(1);
                            }
                            while (roomImg.charAt(0) === '/') {
                                roomImg = roomImg.substr(1);
                            }
                            myHotel.roomImg.push(roomImg);
                        }
                    }
                    myHotel.save(function(err, doc) {
                        if (err) console.log(err);
                        console.log('doc=', doc);
                    })
                }
            });
        });
    });
});
