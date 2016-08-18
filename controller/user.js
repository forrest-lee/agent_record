'use strict';

var User = require('../models/User');
var passport = require('passport');

exports.signup = function (req, res) {
    var username = req.body.username;
    var mobile   = req.body.mobile;
    var password   = req.body.password;
    var repassword = req.body.repassword;
    var comment    = req.body.comment;

    var user = new User({
        username: username,
        mobile:   mobile,
        password: password,
        comment:  comment
    });
    user.save(function (err) {
        if (err) {
            if (err.code === 11000) {
                req.flash('errors', {msg: '此手机号已被注册'});
            }
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('back');
            }
        });
    });
};

// create login
exports.login = function (req, res, next) {
    console.log(req.body);

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', {msg: info.message});
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('back');
            }
        });
    })(req, res, next);

};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};