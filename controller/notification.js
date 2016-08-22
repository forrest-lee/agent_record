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


/**
 * 公告详情
 * @param req
 * @param res
 */
exports.detail = function(req, res) {
    var id = req.params.id;
    Notification.findOne({_id: id})
        .exec((err, notification) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                console.log(notification);
                return res.json({
                    err: 0,
                    notification: notification
                });
            }
        });
};