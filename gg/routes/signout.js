var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	// 清空 session 中用户信息
	req.session.user = null;
	// 退出成功后返回主页
	res.redirect('/');
});

module.exports = router;