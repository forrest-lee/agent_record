var express    = require('express');
var router     = express.Router();
var homeCtrl   = require('../controller/home');
var userCtrl   = require('../controller/user');
var qiniuCtrl  = require('../controller/qiniu');
var infoCtrl   = require('../controller/information');
var notiCtrl   = require('../controller/notification');

/**
 * Home
 */
router.get('/', homeCtrl.index);


var userRouter = express.Router();
userRouter.post('/signup', userCtrl.signup);
userRouter.post('/login', userCtrl.login);
userRouter.post('/logout', userCtrl.logout);


// 七牛云存储
var qiniuApiRouter = express.Router();
qiniuApiRouter.get('/uptoken', qiniuCtrl.uptoken);

// 用户信息
var userApiRouter = express.Router();
userApiRouter.get('/all', userCtrl.allAgency);


/**
 * Name: 借款资料
 * Path: /apiv1/information
 */
var infoApiRouter = express.Router();
infoApiRouter.get('/:id', infoCtrl.detail);
infoApiRouter.get('/:id/attachments', infoCtrl.attachments);
infoApiRouter.post('/:id/attachments', infoCtrl.addAttaches);
infoApiRouter.get('/:id/messages', infoCtrl.messages);
infoApiRouter.post('/:id/messages', infoCtrl.newMessage);
infoApiRouter.post('/new_message', infoCtrl.newInfo);
infoApiRouter.post('/update_status', infoCtrl.updateInfoStatus);


// 客户信息
var clientApiRouter = express.Router();
clientApiRouter.get('/all', infoCtrl.allClient);

// 通知
var notiApiRouter = express.Router();
notiApiRouter.get('/all', notiCtrl.notifications);
notiApiRouter.get('/:id', notiCtrl.detail);
notiApiRouter.post('/new', notiCtrl.newNotification);

/**
 * apiv1
 */
var apiRouter = express.Router();
apiRouter.use('/qiniu', qiniuApiRouter);
apiRouter.use('/user', userApiRouter);
apiRouter.use('/information', infoApiRouter);
apiRouter.use('/client', clientApiRouter);
apiRouter.use('/notification', notiApiRouter);


router.use('/user', userRouter);
router.use('/apiv1', userCtrl.isLogined, apiRouter);

module.exports = router;
