'use strict';

exports.index = function (req, res) {
    res.render('index', {
        title: '小薇学贷'
    });
}