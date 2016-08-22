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
    var username   = req.body.username;
    var password   = req.body.password ? req.body.password : '123456';
    var repassword = req.body.repassword ? req.body.repassword : '123456';
    var role    = req.body.role;
    var parent  = req.body.parent;
    var gender  = req.body.gender;
    var mobile  = req.body.mobile;
    var qq      = req.body.qq;
    var comment = req.body.comment;
    
    if(password != repassword) {
        return res.json({
            err: 1,
            msg: '重复密码不相等'
        });
    }
    

    var user = new User({
        username: username,
        password: password,
        role:     role,
        parent:   parent,
        gender:   gender,
        mobile:   mobile,
        qq:       qq,
        comment:  comment
    });
    
    
    user.save(function (err) {
        if (err) {
            if (err.code === 11000) {
                return res.json({
                    err: 1,
                    msg: '此账户已被注册'
                });
            } else {
                return res.json({
                    err: 1,
                    msg: err
                });
            }
        } else {
            return res.json({
                err: 0,
                msg: '注册成功'
            });
        }
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
                    msg: '登录成功',
                    user: user
                });
            }
        });
    })(req, res, next);

};

exports.logout = function (req, res) {
    req.logout();
    return res.json({
        err: 0,
        msg: '退出登录',
        redirect: true,
        url: '/'
    })
};

/**
 * 中间件: 判断是否登录
 */
exports.isLogined = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
};


/**
 * 查看代理列表(只有管理员可以看)
 * @param req
 * @param res
 */
exports.allAgency = function(req, res) {
    // TODO: 权限验证, 只有管理员有权(中间件也需要加)
    
    User.find({})
        .exec((err, users) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                return res.json({
                    err: 0,
                    users: users
                });
            }
        });
};