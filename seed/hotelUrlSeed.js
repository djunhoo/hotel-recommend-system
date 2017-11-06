// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mongoose = require('mongoose');
var urls = [{
        src: "https://www.goodchoice.kr/product/search/2/2003"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2004"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2005"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2006"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2007"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2008"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2009"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2010"
    },
    {
        src: "https://www.goodchoice.kr/product/search/2/2011"
    }
];
var Url = require('../models/hotelUrl.js').urlModel;

console.log(urls);
urls.forEach(function(url) {
    var options = {
        url: url.src,
        encoding: 'binary'
    };
    request(options, function(err, response, body) {
        if (err) return console.log('err', err);
        var strContents = iconv.decode(body, 'utf-8');
        var $ = cheerio.load(strContents);
        var strlength = $('.adcno2').find('a').length;
        var strHref = $('.adcno2').find('a')[0].attribs.href;
        var strImage = $('.adcno2').find('img')[0].attribs['data-original'];
        console.log('strLength=', strHref);
        console.log('strLength=', strImage);



        for (var i = 0; i < strlength; i++) {
            var hotelUrl = new Url();
            hotelUrl.url = $('.adcno2').find('a')[i].attribs.href;
            hotelUrl.category = "호텔";
            hotelUrl.mainImg = $('.adcno2').find('img')[i].attribs['data-original'];
            while (hotelUrl.mainImg.charAt(0) === '/') {
                hotelUrl.mainImg = hotelUrl.mainImg.substr(1);
            }
            while (hotelUrl.mainImg.charAt(0) === '/') {
                hotelUrl.mainImg = hotelUrl.mainImg.substr(1);
            }
            hotelUrl.save(function(err, doc) {
                if (err) console.log('err=', err);
                if (doc)
                    console.log('dc=', doc);
            });
        }

    });
});
