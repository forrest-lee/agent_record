/**
 * Created by leo on 8/22/16.
 */
var Information = require('../models/Information');
var Attachment = require('../models/Attatchment');
var Message = require('../models/Message');

/**
 * 查询所有客户信息
 * @param req
 * @param res
 */
exports.allClient = function(req, res) {
    // TODO: 权限验证, 只有父级代理有权(中间件也需要加)
    var query = {};
    if(req.query.status) {
        query = {status: req.query.status};
    }
    Information.find(query)
        .populate('agentId')
        .populate('parent')
        .exec((err, infos) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                return res.json({
                    err: 0,
                    infos: infos
                });
            }
        });
};

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
        status: req.body.status,
        
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


/**
 * 更新借款资料状态
 * @param req
 * @param res
 */
exports.updateInfoStatus = function(req, res) {
    var id = req.body.id;
    var status = req.body.status;
    var query = {_id: id};
    
    // TODO: 需要加权限判断
    Information.update(query, {$set: {status: status}}, err => {
        if(err) {
            return res.json({
                err: 1,
                msg: err
            })
        } else {
            return res.json({
                err: 0
            })
        }
    })
};


/**
 * 借款资料详情
 * @param req
 * @param res
 */
exports.detail = function(req, res) {
    var id = req.params.id;
    Information.findOne({_id: id})
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
                return res.json({
                    err: 0,
                    information: info
                })
            }
        });
};


/**
 * 查寻借款资料下附件信息
 * @param req
 * @param res
 */
exports.attachments = function(req, res) {
    var userId = req.user._id;
    Attachment.find({infoId: req.params.id})
        .exec((err, attaches) => {
            if(err) {
                return res.json({err: 1, msg: err});
            } if(attaches.length == 0) {
                return res.json({
                    err: 0,
                    attaches: []
                });
            } else {
                if(attaches[0].owner.toString() == userId.toString()) {
                    return res.json({
                        err: 0,
                        attaches: attaches
                    });
                }
            }
        })
};


/**
 * 添加附件
 * @param req
 * @param res
 */
exports.addAttaches = function(req, res) {
    var attach = new Attachment({
        owner:      req.user._id,
        userAttachId: req.user._id.toString() + req.body.hashId,
    
        filename:   req.body.filename,
        infoId:     req.body.infoId,
        url:        req.body.url,
    });
    console.log(attach);
    
    attach.save((err, attach) => {
        if(err) {
            return res.json({
                err: 1,
                msg: err
            });
        } else {
            return res.json({
                err: 0,
                attach: attach,
                msg: 'upload success'
            })
        }
    })
};


/**
 * 查询借款资料下所有留言
 * @param req
 * @param res
 */
exports.messages = function(req, res) {
    var id = req.params.id;
    Message.find({infoId: id})
        .exec((err, messages) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                return res.json({
                    err: 0,
                    messages: messages
                })
            }
        })
};


/**
 * 发布审核信息
 * @param req
 * @param res
 */
exports.newMessage = function(req, res) {
    var infoId = req.body.id;
    var status = req.body.status;
    var message = new Message({
        infoId: infoId,
        content: req.body.content,
        status: status,
        ownerId: req.user._id,
        ownerName: req.user.username
    });
    
    Information.findById(infoId)
        .exec((err, info) => {
            if(err) {
                return res.json({err: 1, msg: err});
            } else {
                if(info.status == -1) {
                    return res.json({err: 1, msg: '不可更改'});
                } else if(info.status > 0 && info.status < 3) {
                    return res.json({err: 1, msg: '不可更改'});
                } else {
                    // status: 0 或 3
                    message.save((err, message) => {
                        if(err) {
                            return res.json({err: 1, msg: err});
                        } else {
                            return res.json({
                                err: 0,
                                message: message,
                                msg: '消息提交成功'
                            })
                        }
                    });
                }
            }
        });
};