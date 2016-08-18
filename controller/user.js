'use strict';

var User = require('../models/User');
var passport = require('passport');

function  is_wechat(req) {
    if(req.headers['user-agent']) {
        var ua = (req.headers['user-agent']).toLowerCase();
        return (ua.indexOf("micromessenger") > -1);
    } else {
        return false;
    }
}

/**
 * 注册
 */
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
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                err: 2,
                msg: info.message,
                redirect: true,
                url: '/'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json({
                    err: 0,
                    msg: '登录成功'
                });
            }
        });
    })(req, res, next);

};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/#/login');
};

/**
 * 中间件: 判断是否登录
 */
exports.isLogined  = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log('已经登录');
        next();
    } else {
        console.log('没有登录');
        return res.redirect('/');
    }
};