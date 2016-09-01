/**
 * Created by leo on 8/22/16.
 */
var User = require('../models/User');
var Information = require('../models/Information');
var Attachment = require('../models/Attatchment');
var Message = require('../models/Message');
var settings = require('../settings');
var admins = settings.admins;

/**
 * 查询所有客户信息
 * @param req
 * @param res
 */
exports.allClient = function(req, res) {
    var uid = req.user._id;
    var query = {};
    if(req.query.status) {
        query.status = req.query.status;
    }
    
    if(req.user.role == 0) {
        Information.find(query)
            .populate({
                path: 'agentId',
                model: 'User',
                populate: {
                    path: 'parentId',
                    model: 'User'
                }
            })
            .populate('parent')
            .exec((err, infos) => {
                if(err) {
                    return res.json({err: 1, msg: err});
                } else {
                    return res.json({
                        err: 0,
                        infos: infos
                    });
                }
            });
    } else {
        User.find({parentId: uid})
            .exec((err, users) => {
                if(err) {
                    return res.json({err: 1, msg: err});
                }
                var userList = users.map(u => u._id);
                userList.push(uid);
                
                Information.find(query)
                    .populate({
                        path: 'agentId',
                        model: 'User',
                        populate: {
                            path: 'parentId',
                            model: 'User'
                        }
                    })
                    .populate('parent')
                    .where('agentId').in(userList)
                    .exec((err, infos) => {
                        if(err) {
                            return res.json({err: 1, msg: err});
                        } else {
                            return res.json({
                                err: 0,
                                infos: infos
                            });
                        }
                    });
            });
    }
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
    var uid = req.user._id;
    Attachment.find({infoId: req.params.id})
        .populate('ownerId')
        .exec((err, attaches) => {
            if(err) {
                return res.json({err: 1, msg: err});
            } if(attaches.length == 0) {
                return res.json({
                    err: 0,
                    attaches: []
                });
            } else {
                if(attaches[0].ownerId._id.toString() == uid.toString() ||
                    attaches[0].ownerId.parentId.toString() == uid.toString() ||
                        req.user.role == 0 ) {
                    return res.json({
                        err: 0,
                        attaches: attaches
                    });
                } else {
                    return res.json({
                        err: 1,
                        msg: '权限不够'
                    })
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
    var id = req.body.infoId;
    var uid = req.user._id;
    User.findById(uid)
        .exec((err, user) => {
            if(err) {return res.json({err: 1, msg: err})}
            else if(!user) {return res.json({err:1, msg: '用户状态异常(User Not Found)'})}
            else if(user.role == 0) {
                return res.json({err: 1, msg: '权限限制(管理员不能上传)'})
            } else {
                var attach = new Attachment({
                    ownerId:        uid,
                    userAttachId: uid.toString() + req.body.hashId,
                    filename:   req.body.filename,
                    infoId:     id,
                    url:        req.body.url,
                });
    
                attach.save((err, attach) => {
                    if(err) {
                        return res.json({err: 1, msg: err});
                    } else {
                        return res.json({
                            err: 0,
                            attach: attach,
                            msg: 'upload success'
                        })
                    }
                })
            }
        });
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
    var uid = req.user._id;
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
        .populate('agentId')
        .exec((err, info) => {
            if(err) {
                return res.json({err: 1, msg: err});
            } else {
                if(info.status == -1) {
                    return res.json({err: 1, msg: '不可更改'});
                } else if(info.status > 0 && info.status < 3) {
                    return res.json({err: 1, msg: '不可更改'});
                } else {
                    // status: 0 或 3 才能进行编辑
                    
                    if(req.user.role == 0 || info.agentId.parentId.toString() == uid.toString()) {
                        // 只有风控(管理员)和直属上级代理可以发布审核信息
                        info.save((err, obj) => {
                            if(err) {return res.json({err: 1, msg: err});}
                            message.save((err, obj) => {
                                if(err) {return res.json({err: 1, msg: err});}
                                return res.json({
                                    err: 0,
                                    message: obj,
                                    msg: '消息提交成功'
                                })
                            });
                        });
                    } else {
                        return res.json({err: 1, msg: '权限不够'})
                    }
                    
                }
            }
        });
};