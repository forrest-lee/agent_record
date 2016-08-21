/**
 * Created by leo on 8/16/16.
 */
'use strict';
var Information = require('../models/Information');

/**
 * 新建借款资料
 * @param req
 * @param res
 */
exports.newInfo = function(req, res) {
    var info = new Information({
        title: req.body.school + '-' + req.body.name,
        agentId: req.user._id,
        agentName: req.user.username,
        
        mobile: req.body.mobile,
        name: req.body.name,
        qq: req.body.qq,
        school: req.body.school,
        comment: req.body.comment
    });
    
    info.save((err, info) => {
        if(err) {
            return res.json({
                err: 1,
                msg: '新建失败:' + err
            })
        } else {
            return res.json({
                err: 0,
                information: info
            })
        }
    })
};


exports.detail = function(req, res) {
    var id = req.params.id;
    Information.find({_id: id})
        .exec((err, info) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else if(!info) {
                return res.json({
                    err: 1,
                    msg: '404 not found'
                })
            } else {
                console.log(info);
                return res.json({
                    err: 0,
                    information: info
                })
            }
        });
};


