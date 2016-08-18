var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home');
var userCtrl = require('../controller/user');
var qiniuCtrl = require('../controller/qiniu');
var uploadCtrl = require('../controller/upload');


/* GET home page. */
router.get('/', homeCtrl.index);

var userRouter = express.Router();
userRouter.post('/signup', userCtrl.signup);
userRouter.post('/login', userCtrl.login);
userRouter.post('/logout', userCtrl.logout);


//qiniu
var qiniuApiRouter = express.Router();
qiniuApiRouter.get('/uptoken', qiniuCtrl.uptoken);


router.use('/user', userRouter);
router.use('/qiniu', qiniuApiRouter);

module.exports = router;
