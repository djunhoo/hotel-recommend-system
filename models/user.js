// models/ user
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var job = require('./job').jobSchema;
var category = require('./hotelCategory').hotelCategorySchema;
var db = require('./db');
var hotelSchema = require('./hotel').hotelSchema;
var hotel = require('./hotel').hotelModel;

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    age: String,
    job: {
        type: Number,
        ref: 'job'
    },
    sex: String,
    token: String,
    wentHotel: [hotelSchema],
    preferCategory: {
        type: Number,
        ref: 'category'
    },
    profImg: String,
    isLove: Boolean,
    incomeLevel: Number
});

// 해쉬 암호화
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

var User = db.model('user', userSchema);

module.exports = {
    userModel: User,
    userSchema: userSchema
};
