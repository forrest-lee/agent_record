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




var qiniuApiRouter = express.Router();
qiniuApiRouter.get('/uptoken', qiniuCtrl.uptoken);


var apiUserRouter = express.Router();
apiUserRouter.get('/all', userCtrl.allAgency);



/**
 * apiv1
 */
var apiRouter = express.Router();
apiRouter.use('/qiniu', qiniuApiRouter);
apiRouter.use('/user', apiUserRouter);


router.use('/user', userRouter);
router.user('/apiv1', userCtrl.isLogined, apiRouter);

module.exports = router;
