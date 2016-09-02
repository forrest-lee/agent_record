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
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) {
    console.log(username);
    User.findOne({username: username}, function (err, user) {
        console.log(user);
        if (!user) return done(null, false, {message: '该用户不存在'});

        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: '密码错误'});
            }
        });
    });
}));


