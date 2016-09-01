'use strict';
var configs = require('../configs');

exports.index = function (req, res) {
    res.render('index', {
        title: configs.sitename
    });
};

