/**
 * Created by leo on 8/22/16.
 */
var Notification = require('../models/Notification');

/**
 * 新建通知
 * @param req
 * @param res
 */
exports.newNotification = function(req, res) {
    var notification = new Notification({
        ownerId: req.user._id,
        owner: req.user.username,
        title: req.body.title,
        content: req.body.content
    });
    
    notification.save((err, data) => {
        if(err) {
            return res.json({
                err: 1,
                msg: err
            })
        } else {
            return res.json({
                err: 0,
                notification: data
            })
        }
    })
};


/**
 * 查询通知
 * @param req
 * @param res
 */
exports.notifications = function(req, res) {
    Notification.find({})
        .populate('ownerId')
        .exec((err, notifications) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                return res.json({
                    err: 0,
                    notifications: notifications
                })
            }
        })
};


exports.myNotifications = function(req, res) {
    var uid = req.user._id;
    Notification.find({ownerId: uid})
        .populate('ownerId')
        .exec((err, notifications) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                return res.json({
                    err: 0,
                    notifications: notifications
                })
            }
        });
};


/**
 * 公告详情
 * @param req
 * @param res
 */
exports.detail = function(req, res) {
    var id = req.params.id;
    Notification.findOne({_id: id})
        .populate('ownerId')
        .exec((err, notification) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                return res.json({
                    err: 0,
                    notification: notification
                });
            }
        });
};


/**
 * 删除公告
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var id = req.body.id;
    var uid = req.user._id;
    Notification.findById(id)
        .exec((err, noti) => {
            if(err) {return res.json({err: 1, msg: err});}
            if(noti.ownerId.toString() == uid.toString() || req.user.role == 0) {
                // 只有管理员和本人可以删
                Notification.remove({_id: id}, err => {
                    if(err) {
                        return res.json({err:1, msg:err});
                    } else {
                        return res.json({err:0, msg:'删除成功!'});
                    }
                })
            } else {
                return res.json({err:1, msg:'权限不够'})
            }
        })
};