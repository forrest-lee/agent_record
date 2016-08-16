var express = require('express');
var router = express.Router();

import homeCtrl from '../controller/home';
import userCtrl from '../controller/user';


/* GET home page. */
router.get('/', homeCtrl.index);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);


module.exports = router;
