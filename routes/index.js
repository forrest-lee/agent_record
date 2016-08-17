var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home');
var userCtrl = require('../controller/user');
var qiniuCtrl = require('../controller/qiniu');
var uploadCtrl = require('../controller/upload');


/* GET home page. */
router.get('/', homeCtrl.index);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

//qiniu
var qiniuApiRouter = express.Router();
qiniuApiRouter.get('/uptoken', qiniuCtrl.uptoken);

module.exports = router;
