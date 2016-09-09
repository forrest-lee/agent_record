'use strict';

var User     = require('../models/User');
var Information = require('../models/Information');
var Attachment = require('../models/Attatchment');
var Message = require('../models/Message');
var passport = require('passport');
var ccap     = require('ccap');
var async    = require('async');
var request = require('request');
var settings = require('../settings');

function is_wechat(req) {
    if (req.headers['user-agent']) {
        var ua = (req.headers['user-agent']).toLowerCase();
        return (ua.indexOf("micromessenger") > -1);
    } else {
        return false;
    }
}

/**
 * 注册,新增代理
 * 管理员只能开一级, 一级代理只能开二级, 二级只能开三级, 三级没有权限
 * 只能给自己开代理
 */
exports.addAgency = function (req, res) {
    var uid = req.user._id;
    if (req.user.role == 3) {
        return res.json({err: 1, msg: '权限不够(Auth Failed)'});
    }
    
    var username   = req.body.username;
    var name       = req.body.name;
    var password   = req.body.password ? req.body.password : '123456';
    var repassword = req.body.repassword ? req.body.repassword : '123456';
    var role       = req.user.role + 1;
    var parent     = req.user.username;
    var parentId   = uid;
    var gender     = req.body.gender;
    var mobile     = req.body.mobile;
    var qq         = req.body.qq ? req.body.qq : '';
    var comment    = req.body.comment ? req.body.comment : '';
    
    if (password != repassword) {
        return res.json({
            err: 1,
            msg: '重复密码不相等'
        });
    }
    
    var user = new User({
        username: username,
        name:     name,
        password: password,
        role:     role,
        parent:   parent,
        parentId: parentId,
        gender:   gender,
        mobile:   mobile,
        qq:       qq,
        comment:  comment
    });
    
    user.save(function (err) {
        if (err) {
            if (err.code === 11000) {
                return res.json({
                    err: 1,
                    msg: '此账户已被注册'
                });
            } else {
                return res.json({
                    err: 1,
                    msg: err
                });
            }
        } else {
            return res.json({
                err: 0,
                msg: '注册成功'
            });
        }
    });
};


/**
 * 注册(deprecate)
 * @param req
 * @param res
 * @returns {*}
 */
exports.signUp = function (req, res) {
    var username   = req.body.username;
    var name       = req.body.name;
    var password   = req.body.password ? req.body.password : '123456';
    var repassword = req.body.repassword ? req.body.repassword : '123456';
    var role       = req.body.role;
    var parent     = req.body.parent;
    var gender     = req.body.gender;
    var mobile     = req.body.mobile;
    var qq         = req.body.qq ? req.body.qq : '';
    var comment    = req.body.comment ? req.body.comment : '';
    
    if (password != repassword) {
        return res.json({
            err: 1,
            msg: '重复密码不相等'
        });
    }
    
    var user = new User({
        username: username,
        name:     name,
        password: password,
        role:     role,
        parent:   parent,
        gender:   gender,
        mobile:   mobile,
        qq:       qq,
        comment:  comment
    });
    
    user.save(function (err) {
        if (err) {
            if (err.code === 11000) {
                return res.json({
                    err: 1,
                    msg: '此账户已被注册'
                });
            } else {
                return res.json({
                    err: 1,
                    msg: err
                });
            }
        } else {
            return res.json({
                err: 0,
                msg: '注册成功'
            });
        }
    });
};


/**
 * 用户登陆
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.login = function (req, res, next) {
    if (req.body.captcha != req.session.captcha) {
        return res.json({
            err: 1,
            msg: '验证码不正确'
        })
    }
    
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                err:      2,
                msg:      info.message,
                redirect: true,
                url:      '/'
            });
        } else if (user.status == -1) {
            return res.json({
                err: 3,
                msg: '该帐号已注销'
            })
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json({
                    err:  0,
                    msg:  req.user.name + ' 登录成功',
                    user: user
                });
            }
        });
    })(req, res, next);
    
};

/**
 * 登出
 * @param req
 * @param res
 * @returns {*}
 */
exports.logout = function (req, res) {
    req.logout();
    return res.json({
        err:      0,
        msg:      '退出登录',
        redirect: true,
        url:      '/'
    })
};

/**
 * 中间件: 判断是否登录
 */
exports.isLogined = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
};


/**
 * 查看代理列表(只有管理员可以看)
 * @param req
 * @param res
 */
exports.allAgency = function (req, res) {
    if (req.query.role) {
        if (req.query.role <= req.user.role) {
            // 不能越级查看
            return res.json({err: 1, msg: '权限不够'});
        }
    }
    
    if (req.user.role == 3) {
        return res.json({err: 1, msg: '权限不够'});
    }
    
    if (req.user.role == 1) {
        User.find({role: 2, parentId: req.user._id})
            .find({status: 0})
            .populate('parentId')
            .exec((err, users2) => {
                if (err) {
                    return res.json({err: 1, msg: err});
                }
                var userList = users2.map(u => u._id.toString());
                
                User.find({role: 3})
                    .find({status: 0})
                    .populate('parentId')
                    .where('parentId').in(userList)
                    .exec((err, users3) => {
                        if (err) {
                            return res.json({err: 1, msg: err});
                        }
                        if (!req.query.role) {
                            return res.json({
                                err:   0,
                                users: users2.concat(users3).filter(item => item.username != req.user.username)
                            });
                        } else if (req.query.role == 2) {
                            return res.json({
                                err:   0,
                                users: users2.filter(item => item.username != req.user.username)
                            });
                        } else if (req.query.role == 3) {
                            return res.json({
                                err:   0,
                                users: users3.filter(item => item.username != req.user.username)
                            });
                        }
                    })
            });
    } else {
        var query = {};
        if (req.user.role == 0) {
            query = req.query.role ? {role: req.query.role} : {};
        } else if (req.user.role == 2) {
            query = {parentId: req.user._id, role: 3};
        }
        
        User.find(query).populate('parentId')
            .find({status: 0})
            .exec((err, users) => {
                if (err) {
                    return res.json({err: 1, msg: err});
                } else {
                    return res.json({
                        err:   0,
                        users: users.filter(item => item.username != req.user.username)
                    });
                }
            });
    }
};


/**
 * 查找子代理
 * @param req
 * @param res
 */
exports.childAgency = function (req, res) {
    User.find({parentId: req.params.id}).populate('parentId')
        .find({status: 0})
        .exec((err, users) => {
            if (err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                return res.json({
                    err:   0,
                    users: users.filter(item => item.username != req.user.username)
                });
            }
        });
};


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * GET: 生成验证码
 * @param req
 * @param res
 */
exports.getCaptcha = function (req, res) {
    var captcha = ccap({
        width:    180, //set width,default is 256
        height:   60,  //set height,default is 60
        offset:   40,  //set text spacing,default is 40
        quality:  60,  //set pic quality,default is 50
        fontsize: 50,  //set font size,default is 57
        generate: function () {  //Custom the function to generate captcha text
            //generate captcha text here
            var txt = '';
            for (var i = 0; i <= 3; i++) {
                txt += getRandomInt(0, 10).toString();
            }
            return txt;//return the captcha text
        }
    });
    
    var ary = captcha.get();
    var txt = ary[0];
    var buf = ary[1];
    
    req.session.captcha = txt;
    
    return res.end(buf);
};


/**
 * 查看用户详细信息
 * @param req
 * @param res
 */
exports.userDetail = function (req, res) {
    var uid = req.params.id;
    
    User.findById(uid)
        .exec((err, user) => {
            if (err) {
                return res.json({err: 1, msg: err});
            } else if (!user) {
                return res.json({err: 1, msg: '该用户不存在'})
            }
            
            return res.json({
                err:  0,
                user: user,
                msg:  '用户信息加载成功'
            })
        })
};


/**
 * 重置密码
 * @param req
 * @param res
 */
exports.resetPassword = function (req, res) {
    var uid        = req.user.id;
    var password   = req.body.password;
    var repassword = req.body.repassword;
    
    User.findById(uid)
        .exec((err, user) => {
            if (err) {
                return res.json({err: 1, msg: err});
            } else if (!user) {
                return res.json({err: 1, msg: '用户不存在'})
            } else if (password != repassword) {
                return res.json({
                    err: 1,
                    msg: '重复密码不相等'
                });
            }
            
            user.password = password;
            user.save(function (err) {
                if (err) {
                    return res.json({err: 1, msg: err});
                } else {
                    return res.json({err: 0, msg: '密码修改成功'});
                }
            });
        })
};


/**
 * 更新信息
 * @param req
 * @param res
 */
exports.updateInfo = function (req, res) {
    var uid     = req.user.id;
    
    var name    = req.body.name;
    var mobile  = req.body.mobile;
    var gender  = req.body.gender;
    var qq      = req.body.qq;
    var comment = req.body.comment;
    
    User.findById(uid)
        .exec((err, user) => {
            if (err) {
                return res.json({err: 1, msg: err});
            } else if (!user) {
                return res.json({err: 1, msg: '用户不存在'})
            } else if (uid.toString() == user._id.toString() || req.user.role == 0) {
                user.name    = name;
                user.mobile  = mobile;
                user.gender  = gender;
                user.qq      = qq;
                user.comment = comment;
    
                user.save(function (err) {
                    if (err) {
                        return res.json({err: 1, msg: err});
                    } else {
                        return res.json({err: 0, msg: '信息修改成功'});
                    }
                });
            } else {
                return res.json({
                    err: 1,
                    msg: '权限不够'
                });
            }
        })
};


/**
 * 检查用户名是否被占用
 * @param req
 * @param res
 */
exports.isUserExists = function (req, res) {
    var username = req.body.username;
    
    User.findOne({username: username})
        .exec((err, user) => {
            if (err) {
                return res.json({err: 1, msg: err});
            } else if (user) {
                return res.json({err: 2, msg: '用户名已存在'})
            } else {
                return res.json({err: 0, msg: '用户名未被占用'})
            }
        })
};


/**
 * 注销代理
 * @param req
 * @param res
 */
exports.removeAgency = function (req, res) {
    if (req.user.role != 0) {
        return res.json({err: 1, msg: '权限不够'});
    }
    var id = req.body.id;
    User.findById(id)
        .exec((err, user) => {
            if (err) {
                return res.json({err: 1, msg: err});
            }
    
            if(user.role == 3) {
                User.findById(id)
                    .exec((err, usr) => {
                        if (err) {
                            return res.json({err: 1, msg: err});
                        } else if (!usr) {
                            return res.json({err: 1, msg: '找不到该用户(404 Not FOUND)'});
                        } else {
                            usr.status = -1;  // 表示已注销
                            usr.username = usr._id.toString();
                            usr.save(err => {
                                if (err) {
                                    return res.json({err: 1, msg: err});
                                } else {
                                    return res.json({err: 0, msg: '删除成功'})
                                }
                            })
                        }
                    })
            } else if(user.role == 2) {
                User.find({role: 3, parentId: id})
                    .exec((err, users) => {
                        if (err) {
                            return res.json({err: 1, msg: err});
                        }
                        users = users.concat(user);
                        async.each(users, (user, callback) => {
                            User.update({_id: user._id}, {
                                $set: {
                                    status: -1,
                                    username: user._id.toString(),
                                }
                            }, err => callback(err));
                        }, err => {
                            if (err) {
                                return res.json({'err': 1, 'msg': '异常'});
                            } else {
                                return res.json({'err': 0, 'msg': '完成'});
                            }
                        })
                    })
            } else {
                User.find({role: 2, parentId: id})
                    .populate('parentId')
                    .exec((err, users2) => {
                        if (err) {
                            return res.json({err: 1, msg: err});
                        }
                        var userList = users2.map(u => u._id.toString());
                
                        User.find({role: 3})
                            .where('parentId').in(userList)
                            .exec((err, users3) => {
                                if (err) {
                                    return res.json({err: 1, msg: err});
                                }
                        
                                var users = users2.concat(users3).concat(user);
                                console.log(users);
                                async.each(users, (user, callback) => {
                                    User.update({_id: user._id}, {
                                        $set: {
                                            status: -1,
                                            username: user._id.toString(),
                                        }
                                    }, err => callback(err));
                                }, err => {
                                    if (err) {
                                        return res.json({'err': 1, 'msg': '异常'});
                                    } else {
                                        return res.json({'err': 0, 'msg': '完成'});
                                    }
                                })
                            })
                    });
            }
        });
};


/**
 * TODO: 删除代理及其子代理（删除所有相关的数据）
 * @param req
 * @param res
 */
exports.destroyAll = function(req, res) {
    if (req.user.role != 0) {
        return res.json({err: 1, msg: '权限不够'});
    }
    
    qiniu.conf.ACCESS_KEY = settings.QN_ACCESS_KEY;
    qiniu.conf.SECRET_KEY = settings.QN_SECRET_KEY;
    
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();
    
    //你要测试的空间， 并且这个key在你空间中存在
    var bucket = settings.QN_Bucket_Name;
    var putPolicy = new qiniu.rs.PutPolicy(settings.QN_Bucket_Name);
    var token = putPolicy.token();
    
    
    var id = req.body.id;   // 要删除的用户
    
    Notification.remove({ownerId: id}, err => {
        if(err) {
            return res.json({err:1, msg:err});
        }
        Information.remove({agentId: id}, err => {
            if(err) {return res.json({err:1, msg:err});}
            Message.remove({ownerId: id}, err => {
                if(err) {return res.json({err:1, msg:err});}
                Attachment.find({ownerId: id})
                    .exec((err, attaches) => {
                        if(err) {return res.json({err: 1, msg: err});}
    
                        var options = {
                            url: '/batch',
                            headers: {
                                'HOST': 'rs.qiniu.com',
                                'Content-Type':   'application/x-www-form-urlencoded',
                                'Authorization':  'QBox ' + token,
                                'User-Agent': 'request'
                            }
                        };
                        var formData = attaches.map(item => {
                            return {'op': '/delete/' + urlsafeBase64Encode(bucket + ':' + item.key)}
                        });
    
                        request.post(options, {form: formData}, (err, res) => {
                            
                        });
                        
                    });  // End Attachment.find()
            }); // End Message.remove()
        });  // End Information.remove();
    }); //  End Notification.remove();
};



function urlsafeBase64Encode(jsonFlags) {
    var encoded = new Buffer(jsonFlags).toString('base64');
    return exports.base64ToUrlSafe(encoded);
}