var Hotel = require('../models/hotel').hotelModel;
var uuid = require('node-uuid');
var download = require('image-downloader');
var imageArray = [];

Hotel.find({}, function(err, docs) {
    docs.forEach(function(doc) {
        imageArray.push(doc.mainImg);
    });
    console.log('imgsc=', imageArray);

    imageArray.forEach(function(src) {
        console.log('src=', src);
        var random_name = uuid.v4();
        var options = {
            url: "http://" + src,
            dest: '../server_hotel/public/images/hotel/'+ random_name + '.jpg' // Save to /path/to/dest/image.jpg
        }

        download.image(options)
            .then(({
                filename,
                image
            }) => {
                var real_url = '/images/hotel/' + random_name + '.jpg';
                Hotel.findOneAndUpdate({mainImg: src}, {mainImg: real_url}, {
                    upsert: true
                }, function(err, doc) {
                    if (err) console.log('err=', err);
                    console.log('doc=', doc);
                });
            }).catch((err) => {
                throw err
            })
    });
});
