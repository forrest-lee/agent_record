var express    = require('express');
var router     = express.Router();
var homeCtrl   = require('../controller/home');
var userCtrl   = require('../controller/user');
var qiniuCtrl  = require('../controller/qiniu');
var infoCtrl   = require('../controller/information');
var notiCtrl   = require('../controller/notification');
var attachCtrl = require('../controller/attach');

/**
 * Home
 */
router.get('/', homeCtrl.index);


var userRouter = express.Router();
//userRouter.post('/signUp', userCtrl.signUp);      // 注册用户
userRouter.post('/login', userCtrl.login);        // 登陆
userRouter.post('/logout', userCtrl.logout);      // 登出
userRouter.get('/captcha', userCtrl.getCaptcha);  // 验证码


// 七牛云存储
var qiniuApiRouter = express.Router();
qiniuApiRouter.get('/uptoken', qiniuCtrl.uptoken);  // 获取七牛上传token

// 用户信息
var userApiRouter = express.Router();
userApiRouter.get('/all', userCtrl.allAgency);                  // 获取所有用户 (query?status=0、1、2、3)
userApiRouter.get('/:id/child', userCtrl.childAgency);          // 获取用户的子代理
userApiRouter.get('/:id', userCtrl.userDetail);                 // 获取用户信息
userApiRouter.post('/reset_password', userCtrl.resetPassword);  // 重置密码
userApiRouter.post('/exists', userCtrl.isUserExists);           // 检查用户名是否存在
userApiRouter.post('/add', userCtrl.addAgency);                 // 新增代理
userApiRouter.post('/delete', userCtrl.removeAgency);           // 删除代理
userApiRouter.post('/update_info', userCtrl.updateInfo);         // 更新基本信息
userApiRouter.post('destroy_all', userCtrl.destroyAll);   // TODO


/**
 * Name: 借款资料
 * Path: /apiv1/information
 */
var infoApiRouter = express.Router();
infoApiRouter.get('/all', infoCtrl.allClient);  // 所有
infoApiRouter.get('/:id', infoCtrl.detail);                    // 获取资料基本信息
infoApiRouter.get('/:id/attachments', infoCtrl.attachments);   // 获取资料附件链接
infoApiRouter.post('/add_attachments', infoCtrl.addAttaches);  // 上传资料
infoApiRouter.get('/:id/messages', infoCtrl.messages);         // 查询某资料下所有审核信息记录
infoApiRouter.post('/new_message', infoCtrl.newMessage);       // 发布审核信息
infoApiRouter.post('/new', infoCtrl.newInfo);                    // 新建借款资料
infoApiRouter.post('/update_status', infoCtrl.updateInfoStatus); // 更新资料状态

var attachApiRouter = express.Router();
attachApiRouter.post('/delete', attachCtrl.removeAttach);  // 删除附件
attachApiRouter.post('/download_all', attachCtrl.downloadAll); // 以压缩包形式下载所有文件


// 通知
var notiApiRouter = express.Router();
notiApiRouter.get('/all', notiCtrl.notifications);    // 所有公告
notiApiRouter.get('/mine', notiCtrl.myNotifications);    // 我的公告
notiApiRouter.get('/:id', notiCtrl.detail);           // 获取公告内容
notiApiRouter.post('/new', notiCtrl.newNotification); // 新建公告
notiApiRouter.post('/delete', notiCtrl.delete);       // 删除公告

/**
 * apiv1
 */
var apiRouter = express.Router();
apiRouter.use('/qiniu', qiniuApiRouter);
apiRouter.use('/user', userApiRouter);
apiRouter.use('/information', infoApiRouter);
apiRouter.use('/attach', attachApiRouter);
apiRouter.use('/notification', notiApiRouter);


router.use('/user', userRouter);
router.use('/apiv1', userCtrl.isLogined, apiRouter);

module.exports = router;
