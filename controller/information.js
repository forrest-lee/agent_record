/**
 * Created by leo on 8/22/16.
 */
var Information = require('../models/Information');
var Attachment = require('../models/Attatchment');

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
    Attachment.find({})
        .exec((err, attaches) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                })
            } else {
                return res.json({
                    err: 0,
                    attaches: attaches
                });
            }
        })
};


/**
 * 添加附件
 * @param req
 * @param res
 */
exports.addAttaches = function(req, res) {
    if (req.files && req.files.codecsv != 'undifined') {
        var temp_path = req.files.codecsv.path;
        if (temp_path) {
            fs.readFile(temp_path, 'utf-8', function(err, content) {
                //文件的内容
                console.log('content',content);
                // 删除临时文件
                fs.unlink(temp_path);
            });
        }
    }
};


/**
 * 查询所有客户信息
 * @param req
 * @param res
 */
exports.allClient = function(req, res) {
    // TODO: 权限验证, 只有父级代理有权(中间件也需要加)
    
    Information.find({})
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