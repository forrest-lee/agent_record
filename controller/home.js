'use strict';

exports.index = function (req, res) {
    res.render('index', {
        title: '人人花'
    });
}