var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home');
var userCtrl = require('../controller/user');


/* GET home page. */
router.get('/', homeCtrl.index);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);


module.exports = router;
