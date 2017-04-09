var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 进入登录页
router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signin', {
		title: '哟，进来唠嗑咯？我已经迫不及待了....'
	});
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
	var username = req.fields.username;
	var password = req.fields.password;

	User.findOne({username: username}, function(err, user) {
		if(err) {console.log(err);}

		if(user == null) {
			req.flash('error', '用户名不存在！')
			return res.redirect('/signin');
		}

		user.comparePassword(password, function(err, isMatch) {
			if(err) {console.log(err);}

			if(isMatch) {
				req.session.user = user;
				return res.redirect('/');
			}else{
				req.flash('error', '密码错误！')
				return res.redirect('signin');
			}
		});
	});
});

module.exports = router;