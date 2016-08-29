'use strict';
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    createAt: Date,
    updateAt: Date,

    role: {
        type:    Number,
        default: -1
    }, // 角色: 0: 管理员, 1: 一级代理, 2: 二级代理, 3: 三级代理, -1: 角色异常
    parent:   {type: String, default: ''},  // 上级代理id
    username: {type: String, unique: true}, // 帐号
    name:     {type: String},
    password: {type: String},
    gender:   {type: Number, default: -1},  // 男:0, 女:1
    mobile:   {type: String, unique: true },  // 手机号(限定11位)
    qq:       {type: String},
    comment:  String  // 备注
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
        if (!user.mobile) {
            user.mobile = "null" + Date.now() + "" + Math.floor(Math.random() * 10000);
        }
        bcrypt.genSalt(5, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        this.updateAt = Date.now();
        next();
    }
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    }
};
UserSchema.virtual('phone').get(function () {
    if (this.mobile.indexOf("null") === 0) {
        return undefined;
    }
    return this.mobile;
});


module.exports = mongoose.model('User', UserSchema);