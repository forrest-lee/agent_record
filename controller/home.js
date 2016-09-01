'use strict';
import configs from '../configs';

exports.index = function (req, res) {
    res.render('index', {
        title: configs.sitename
    });
};

