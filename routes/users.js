module.exports = function(passport) {
    var express = require('express');
    var router = express.Router();

    var User = require('../models/user').userModel;
    var Hotel = require('../models/hotel').hotelModel;
    var Comment = require('../models/comment').commentModel;
    var common = require('../config/etc');
    var Job = require('../models/job').jobModel;
    var Category = require('../models/hotelCategory').hotelCategoryModel;

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('successMessage', '로그인이 필요합니다.');
            res.redirect('/users/login');
        }
    }

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
