var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home');
var userCtrl = require('../controller/user');
var qiniuCtrl = require('../controller/qiniu');
var uploadCtrl = require('../controller/upload');

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
var apiUserRouter = express.Router();
apiUserRouter.get('/all', userCtrl.allAgency);


// 借款资料
var apiInfoRouter = express.Router();
apiInfoRouter.get('/:id', uploadCtrl.detail);
apiInfoRouter.post('/new', uploadCtrl.newInfo);


/**
 * apiv1
 */
var apiRouter = express.Router();
apiRouter.use('/qiniu', qiniuApiRouter);
apiRouter.use('/user', apiUserRouter);
apiRouter.use('/information', apiInfoRouter);


router.use('/user', userRouter);
router.use('/apiv1', userCtrl.isLogined, apiRouter);

module.exports = router;
