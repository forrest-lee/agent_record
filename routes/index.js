var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home');

/* GET home page. */
router.get('/', homeCtrl.index);



module.exports = router;
