var express    = require('express');
var router     = express.Router();
var homeCtrl   = require('../controller/home');
var userCtrl   = require('../controller/user');
var qiniuCtrl  = require('../controller/qiniu');
var uploadCtrl = require('../controller/upload');
var infoCtrl   = require('../controller/information');

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


// 借款资料
var infoApiRouter = express.Router();
infoApiRouter.get('/:id', uploadCtrl.detail);
infoApiRouter.post('/new', uploadCtrl.newInfo);


// 客户信息
var clientApiRouter = express.Router();
clientApiRouter.get('/all', infoCtrl.allClient);


/**
 * apiv1
 */
var apiRouter = express.Router();
apiRouter.use('/qiniu', qiniuApiRouter);
apiRouter.use('/user', userApiRouter);
apiRouter.use('/information', infoApiRouter);
apiRouter.use('/client', clientApiRouter);


router.use('/user', userRouter);
router.use('/apiv1', userCtrl.isLogined, apiRouter);

module.exports = router;
