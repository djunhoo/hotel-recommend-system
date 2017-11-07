module.exports = function(passport) {
    var express = require('express');
    var router = express.Router();

    var User = require('../models/user').userModel;
    var Hotel = require('../models/hotel').hotelModel;
    var Comment = require('../models/comment').commentModel;
    var common = require('../config/etc');
    var Job = require('../models/job').jobModel;
    var Category = require('../models/hotelCategory').hotelCategoryModel;
    var Location = require('../models/location').locationModel;

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('successMessage', '로그인이 필요합니다.');
            res.redirect('/users/login');
        }
    }

    function getRecommendData(req, users) {
        var myUser = req.user;

        var recommendData = [];
        var agePoint = 0.15;
        var jobPoint = 0.1;
        var incomePoint = 0.2;
        var sexPoint = 0.25;
        var lovePoint = 0.3;
        for(var i=0; i<users.length; i++) {
            console.log('myUser=', myUser);
            console.log('userArray=', users[i]);
            if(myUser._id == users[i]._id) {
                continue;
            } else {
                var ageSum, jobSum, incomeSum, sexSum, loveSum;

                ageSum = (myUser.age == users[i].age) ? 1*agePoint : 0*agePoint;
                jobSum = (myUser.job == users[i].job) ? 1*jobPoint : 0*jobPoint;
                incomeSum = (myUser.incomeLevel == users[i].incomeLevel) ? 1*incomePoint : 0*incomePoint;
                sexSum = (myUser.sex == users[i].sex) ? 1*sexPoint : 0*sexPoint;
                loveSum = (myUser.isLove == users[i].isLove) ? 1*lovePoint : 0*lovePoint;

                var SumPoint =  ageSum+jobSum+incomeSum+sexSum+loveSum;
                recommendData.push({
                    point: SumPoint,
                    userId: users[i]._id
                })
            }
        }
        console.log('infunction=', recommendData);
        return recommendData;
    }

    router.post('/recommend', function(req, res, next) {
        var user = req.user;
        var location = req.body.location;

        if (user == undefined) {
            console.log('("user is not found")')
            return next(new Error("user is not found"));
        }

        if (!location)
            location = "서울";
        console.log('location=', location);

        User.find({'wentHotel.address': new RegExp(location, "i")}, function(err, users) {
            console.log('usr=', user.wentHotel);
            var recommendData = getRecommendData(req, users);

            var options = {
                $or: [{}]
            };

            recommendData = recommendData.sort(function(a, b){
                return b.point-a.point
            });
            var maxNumber = recommendData.length < 3 ? recommendData.length : 3;
            for(var i=0; i<maxNumber; i++) {
                 options.$or.push({
                     "_id": recommendData[i].userId
                 });
            }
            options.$or.splice(0, 1);
            //console.log('options', options);
             User.find(options)
            .exec()
            .then(function(simmilarUsers) {
                var recommendHotel = [];
                for(var i=0; i<simmilarUsers.length; i++) {
                    for(var j=0; j<simmilarUsers[i].wentHotel.length) {
                        if(simmilarUsers[i].wentHotel[0].includes(location) == true ) {
                            recommendHotel.push({
                                hotel: simmilarUsers[i].wentHotel[0],
                                userId: simmilarUsers[i]._id
                            });
                        }
                    }
                }

                res.render('users/recommendResult', {
                    user:user,
                    title: "호텔 추천",
                    hotels: recommendHotel
                })

            });

        });
    });

    router.get('/recommend', isLoggedIn, function(req, res, next) {
        Location.find({})
        .exec()
        .then(function(location) {
            res.render('users/recommend', {
                message: req.flash('loginMessage'),
                title: '호텔 추천',
                user: req.user,
                locations: location
            })
        });

    });

    router.post('/hotel/went', function(req, res, next) {
        var user = req.user;
        var hotelId = req.body.hotel_id;

        if (user == undefined) {
            console.log('("user is not found")')
            return next(new Error("user is not found"));
        }


        if (!hotelId)
            next(new Error("hotelId is not found"));

        Hotel.findOne({
            _id: hotelId
        }, function(err, hotel) {
            if (err)
                next(new Error("ERR"));
            if (!hotel)
                next(new Error("hotel is not found"));


            var userHotel = user.wentHotel;
            var hotelMap = new Map();
            userHotel.forEach(function(userTel) {
                hotelMap.set(userTel.name, userTel);
            });

            var checkHotel = hotelMap.get(hotel.name)
            if (!checkHotel) {
                user.wentHotel.push(hotel);
            }
            user.save(function(err, doc) {
                res.send({
                    user: user,
                    title: hotel.name,
                    hotel: hotel
                })
            });
        });
    });

    router.get('/mypage', isLoggedIn, function(req, res, next) {
        User.findOne({_id: req.user._id})
        .populate('job')
        .exec()
        .then(function(user) {
            console.log('user=', user);
            res.render('users/mypage', {
                message: req.flash('loginMessage'),
                success: req.flash('successMessage'),
                title: '로그인',
                user: user
            });
        });

    });

    router.get('/login', function(req, res, next) {
        res.render('users/login', {
            message: req.flash('loginMessage'),
            success: req.flash('successMessage'),
            title: '로그인',
            user: req.user
        });
    });

    router.get('/signup', function(req, res, next) {
        Job.find({}, function(err, doc) {
            console.log('job=', doc);
            res.render('users/signup', {
                message: req.flash('loginMessage'),
                success: req.flash('successMessage'),
                title: '회원 가입',
                jobs: doc,
                user: req.user
            });
        });

    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    }));

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/users/login',
        failureRedirect: '/users/signup',
        failureFlash: true,
    }));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    /* GET users listing. */
    router.get('/', function(req, res, next) {
        res.send('respond with a resource');
    });


    return router;
}
