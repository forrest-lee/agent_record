var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var wxStrategy = require('./libs/wxstrategy');

var User = require('../models/User');

var configs = require('../settings');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy({usernameField: 'mobile'}, function (phoneno, password, done) {
    User.findOne({mobile: phoneno}, function (err, user) {
        if (!user) return done(null, false, {message: '验证失败'});
        if (user.role == 2) return done(null, false, {message: '此用户已被停用,请联老师或管理员'}); //forbidden user is forbided.role :2
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: '验证失败'});
            }
        });
    });
}));


