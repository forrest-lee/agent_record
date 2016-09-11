/**
 * Created by leo on 9/3/16.
 */
var async = require('async');
var User = require('../models/User');
var Information = require('../models/Information');
var Attachment = require('../models/Attatchment');

var qiniu = require("qiniu");

var settings = require('../settings');
var admins = settings.admins;
var request = require('request');


/**
 * 删除上传的附件(单个)
 * @param req
 * @param res
 */
exports.removeAttach = function(req, res) {
    var uid = req.user._id;
    var id = req.body.id;
    
    qiniu.conf.ACCESS_KEY = settings.QN_ACCESS_KEY;
    qiniu.conf.SECRET_KEY = settings.QN_SECRET_KEY;
    
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();
    
    //你要测试的空间， 并且这个key在你空间中存在
    var bucket = settings.QN_Bucket_Name;
    
    
    Attachment.findById(id)
        .exec((err, attach) => {
            if(err) {
                return res.json({err: 1, msg: err});
            } else if(!attach) {
                return res.json({err:1, msg:'附件不存在'});
            } else {
                if(attach.ownerId.toString() == uid.toString()) {
                    Information.findById(attach.infoId)
                        .exec((err, info) => {
                            if(err) {return res.json({err: 1, msg: err});}
                            else if(!info) {return res.json({err:1, msg:'资料不存在'})}
                            else if(info.status > -1 && info.status < 3) {
                                return res.json({err:1, msg:'当前状态下不可删除!'})
                            }
                            
                            key = attach.key;
    
                            //删除资源
                            client.remove(bucket, key, function(err, ret) {
                                if (!err) {
                                    // ok
                                    Attachment.remove({_id: attach._id}, err => {
                                        if(err) {
                                            return res.json({err:1, msg:err});
                                        } else {
                                            return res.json({err:0, msg:'删除成功!'});
                                        }
                                    })
                                } else {
                                    console.log(err);
                                    return res.json({err:1, msg:err});
                                }
                            });
                        })
                    
                } else {
                    return res.json({
                        err: 1,
                        msg: '权限不够'
                    })
                }
            }
        })
};



exports.downloadAll = function(req, res) {
    var options = {
        url: '/pfop/',
        headers: {
            'HOST': 'api.qiniu.com',
            'Content-Type':   'application/x-www-form-urlencoded',
            'Authorization':  'QBox ' + token,
            'User-Agent': 'request'
        }
    };
    var formData = {
        'bucket': settings.QN_Bucket_Name + '&key=1.png&fops=mkzip/2/'
    };
    
    request.post(options, {form: formData}, (err, res) => {
        console.log(res);
    });
};