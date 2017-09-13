// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');
var mongoose = require('mongoose');
var Hotel = require('../models/hotel').hotelModel;
var urls = [];
urls.push("https://www.goodchoice.kr/product/detail?ano=23401");
urls.push("https://www.goodchoice.kr/product/detail?ano=3805");
urls.push("https://www.goodchoice.kr/product/detail?ano=3806");
urls.push("https://www.goodchoice.kr/product/detail?ano=21000");

console.log(urls);
urls.forEach(function(url){
	var options = {
	    url: url,
	    encoding: 'binary'
	};
	request(options, function(err, response, body) {
	    if(err) return console.log('err', err);
	    var strContents = iconv.decode(body, 'utf-8');
	    var $ = cheerio.load(strContents);
	    var strName = $('.info').find('h2')[0].children;
	    var strAddress = $('.address')[0];
	    var strimage = $('.swiper-wrapper').find('img')
	    var strlength = $('.swiper-wrapper').find('img').length;
	    var myHotel = new Hotel();
	    myHotel.name = strName[0].data;
	    myHotel.address = strAddress.children[0].data;
	    for(var i=0; i<strlength; i++) {
	    	myHotel.img_url.push(strimage[i].attribs['data-src']);
	    }
	    myHotel.save(function(err, doc) {
	    	if(err) console.log(err);
	    	console.log('doc=', doc);
	    })
	});
});
