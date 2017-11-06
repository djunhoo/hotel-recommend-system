// serviceseed.js
var db = require('../models/db');
var Location = require('../models/location').locationModel;
var mongoose = require('mongoose');

var myLocation = [
    new Location({
        name: "서울"
    }),
    new Location({
        name: "경기"
    }),
    new Location({
        name: "인천"
    }),
    new Location({
        name: "강원"
    }),
    new Location({
        name: "부산"
    }),
    new Location({
        name: "경남"
    }),
    new Location({
        name: "대구"
    }),
    new Location({
        name: "경북"
    }),
    new Location({
        name: "울산"
    }),
    new Location({
        name: "대전"
    }),
    new Location({
        name: "충남"
    }),
    new Location({
        name: "충북"
    }),
    new Location({
        name: "광주"
    }),
    new Location({
        name: "전남"
    }),
    new Location({
        name: "전북"
    }),
    new Location({
        name: "제주"
    })
];
console.log('myLocation=', myLocation)
var done = 0;
for (var i = 0; i < myLocation.length; i++) {
    myLocation[i].save(function(err, result) {
        console.log('result=', result);
        done++;
        if (done == myLocation.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
