'use strict';
var qiniu = require('qiniu');
var settings = require('../settings');

qiniu.conf.ACCESS_KEY = settings.QN_ACCESS_KEY;
qiniu.conf.SECRET_KEY = settings.QN_SECRET_KEY;

exports.uptoken = function(req, res){
    var putPolicy = new qiniu.rs.PutPolicy(settings.QN_Bucket_Name);
    var token = putPolicy.token();
    return res.json({uptoken:token});
};