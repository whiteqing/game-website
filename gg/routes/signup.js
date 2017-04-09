//注册
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');
var path = require('path');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// PUT /signup/username ajax交互验证用户名是否存在
router.put('/username', checkNotLogin, function(req, res, next) {
	var name = req.query.name;
	User.findOne({username: name}, function(err, user) {
		if(err) {console.log(err);}

		if(user) {
			return res.json({success: 1});
		}else{
			return res.json({success: 0});
		}
	});
});
// PUT /signup/nickname ajax交互验证昵称是否存在
router.put('/nickname', checkNotLogin, function(req, res, next) {
	var nickname = req.query.nickname;
	User.findOne({nickname: nickname}, function(err, user) {
		if(err) {console.log(err);}

		if(user) {
			return res.json({success: 1});
		}else{
			return res.json({success: 0});
		}
	});
});
// GET /signup 进入注册页
router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signup', {
		title: '注册'
	});
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
	var username = req.fields.username;
	var password = req.fields.password;
	var confirmPassword = req.fields.confirmPassword;
	var nickname = req.fields.nickname;
	var gender = req.fields.gender;
	var age = req.fields.age;
	var constellation = req.fields.constellation;
	var avatar = req.files.avatar.path.split(path.sep).pop();
	// 头像不是必须参数，设置一个默认头像！！
	try {
		if(!req.files.avatar.name) {
			avatar = 'defaultAvatar.jpg';
			throw new Error('!');
		}
	}catch(e) {
		fs.unlink(req.files.avatar.path);
	}
	var bio = req.fields.bio;
	// 服务器校验二次参数，永远不要相信客户端的校验
	try {
		if (!(username.length >= 5 && username.length <= 11)) {
		    throw new Error('用户名请限制在 5-11 个字符！');
		}
		if (!(password.length >= 6 && password.length <= 16)) {
			throw new Error('密码请限制在 6-16 个字符！');
		}
		if (password != confirmPassword) {
			throw new Error('两次输入密码不一致！');
		}
		if (!(nickname.length <=7 && nickname.length != 0)) {
			throw new Error('昵称请限制在7个字符以内,并且不能为空！');
		}
		if (['m', 'f', 'x'].indexOf(gender) === -1) {
			throw new Error('性别只能是选项中之一哦！不要试图改变数据！');
		}
		if (!(age > 15 && age < 60)) {
			throw new Error('年龄就不要小于16大于60了吧！');
		}
		if (['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
		'Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(constellation) === -1) {
			throw new Error('星座只能是选项中之一哦！不要试图改变数据！');
		}
	} catch(e) {
		// 注册失败，异步删除上传的头像
	    fs.unlink(req.files.avatar.path);
	    req.flash('error', e.message);
	    return res.redirect('/signup');
	}
	// 待写入数据库的用户信息
	var _user = {
		username: username,
	    password: password,
	    nickname: nickname, 
	    gender: gender,
	    age: age,
	    constellation: constellation,
	    avatar: avatar,
	    bio: bio
	}
	//
	User.findOne({username: username}, function(err, user) {
		if(err) {console.log(err);}

		if(user != null) {
			fs.unlink(req.files.avatar.path);
			req.flash('error', '用户名已存在！');
			return res.redirect('signup');
		}else{
			user = new User(_user);
			user.save(function(err, user) {
				if(err) {console.log(err);}

				req.session.user = user;
				res.redirect('/');
			});
		}
	});
});

module.exports = router;