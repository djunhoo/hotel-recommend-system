var express = require('express');
var router = express.Router();
var Hotel = require('../models/hotel').hotelModel;
var Comment = require('../models/comment').commentModel;
var common = require('../config/etc');

/* GET home page. */

router.post('/comment/write', function(req, res, next) {

    if(!req.user) {
        console.log('로그인!')
        res.send({
            error: "로그인을 해주세요."
        })
    }

    var hotelId = req.body.hotelId;
    var userId = req.user._id;
    var content = req.body.content;
    var point = req.body.point;

    if (!hotelId || !userId || !content || !point) {
        console.log('inavlid params');
        return;
    }

    Comment.findOne({
        userId: userId,
        hotelId: hotelId
    }, function(err, comment) {
        if (comment) {
            res.send({
                error: "이미 리뷰를 다셨습니다. 리뷰는 웹툰당 한 번만 쓸 수 있습니다."
            })
        } else {
            var commentObject = new Comment();
            commentObject.content = content;
            commentObject.point = point;
            commentObject.userId = userId;
            commentObject.hotelId = hotelId;
            commentObject.regdate = common.regDateTime();
            commentObject.save();
            Comment.populate(commentObject, {
                path: "userId"
            }, function(err, populateComment) {
                res.send(populateComment);
            });

        }
    });
});

router.get('/:hotel_id', function(req, res, next) {
    var hotel_id = req.params.hotel_id;
    console.log('id=', hotel_id);
    var isRead = true;

    if (!hotel_id) {
        console.log('파라미터 에러');
    }
    Hotel.find({
            _id: hotel_id
        }).populate('categorys')
        .exec(function(err, doc) {
            if (err) next(err);

            if (!doc) {
                res.json({
                    err: "찾는 웹툰이 없다."
                })
            }
            console.log('doc-', doc[0].link_url);

            if (req.user) {
                var hotelMap = new Map();
                req.user.wentHotel.forEach(function(userTel) {
                    hotelMap.set(userTel.name, userTel);
                });
                var checkHotel = hotelMap.get(doc[0].name);
                if (checkHotel) {
                    isRead = false;
                }
            }
            console.log('isRead=', isRead);
            var query = Comment.find({
                hotelId: doc[0]._id
            }).populate('userId').exec();
            query.then(function(comments) {
                console.log("댓글=", comments);
                res.render('hotel/hotel', {
                    title: doc[0].name,
                    user: req.user,
                    hotel: doc[0],
                    isRead: isRead,
                    comments: comments
                });
            });
        });
});


router.get('/', function(req, res, next) {
	Hotel.find({},'-__v', function(err, docs) {
		res.json({
			hotel: docs
		})
	})
});

module.exports = router;
