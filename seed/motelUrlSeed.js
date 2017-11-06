// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mongoose = require('mongoose');
var urls = [{
        src: "https://www.goodchoice.kr/product/search/1/18"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/1"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/2"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/3"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/4"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/5"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/6"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/7"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/9"
    },
    {
        src: "https://www.goodchoice.kr/product/search/1/10"
    }
];
var Url = require('../models/url.js').urlModel;

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
        var strlength = $('.adcno1').find('a').length;
        var strHref = $('.adcno1').find('a')[0].attribs.href;
        var strImage = $('.adcno1').find('img')[0].attribs['data-original'];
        console.log('strLength=', strHref);
        console.log('strLength=', strImage);



        for (var i = 0; i < strlength; i++) {
            var hotelUrl = new Url();
            hotelUrl.url = $('.adcno1').find('a')[i].attribs.href;
            hotelUrl.category = "모텔";
            hotelUrl.mainImg = $('.adcno1').find('img')[i].attribs['data-original'];
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
