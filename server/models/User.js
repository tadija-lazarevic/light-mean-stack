var mongoose        = require('mongoose');
var bcrypt          = require('bcryptjs');
var crypto          = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');

var User = new mongoose.Schema({
    email   : {type: String, unique: true, lowercase: true},
    password: {type: String, select: false},

    activationToken       : {type: String, default: ''},
    activationTokenExpires: {type: Date, default: Date.now},

    passwordResetToken  : {type: String, default: ''},
    passwordResetExpires: {type: Date, default: Date.now},

    name: {
        displayName: {type: String, default: '', unique: true},
        fullName   : {type: String, default: ''}
    },
    info: {
        address: {type: String, default: ''},
        country: {type: String, default: ''},
        phone  : {type: String, default: ''},
        age    : {type: String, default: ''},
        gender : {type: String, default: ''},
        bio    : {type: String, default: ''}
    },

    picture : {type: String, default: 'no-image.jpg'},
    status  : {type: String, default: 'Active'},
    platform: {type: String, default: ''},
    facebook: {type: String, default: ''},

    dtCreated : {type: Date, default: Date.now},
    dtModified: {type: Date, default: Date.now},
    lastLogin : {type: Date, default: Date.now},

    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
    prize : [{type: mongoose.Schema.Types.ObjectId, ref: 'Prize'}],


    recycled: {type: Number, default: 0}
});

User.plugin(uniqueValidator);

User.pre('save', function (next) {
    var user = this;

    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

mongoose.model('User', User);
