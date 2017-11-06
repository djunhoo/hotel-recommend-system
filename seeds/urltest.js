// urltest.js

// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mongoose = require('mongoose');
var Hotel = require('../models/hotel').hotelModel;
var Url = require('../models/url').urlModel;

var urls = [
	{
		url: "https://www.goodchoice.kr/product/detail?ano=6959&adcno=2&sel_date=2017-11-06&sel_date2=2017-11-07"
	}
]

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
            var strPhoneNumber = $('.call');
            console.log('strPhoneNumber=', strPhoneNumber);

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
                myHotel.phonenumber = strPhoneNumber
                if (strlength > 5) {
                    for (var i = 0; i < 5; i++) {
                        myHotel.roomImg.push(strimage[i].attribs['data-src']);
                    }
                } else {
                    for (var i = 0; i < strlength; i++) {
                        myHotel.roomImg.push(strimage[i].attribs['data-src']);
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