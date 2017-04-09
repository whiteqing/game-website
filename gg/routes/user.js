var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


// GET user/id 用户个人信息页
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	
	User.findById(id, function (err, user) {
		res.render('userdetail', {
			title: 'welcome to ' + user.nickname + ' home!!',
			user: user
		});
	});
		
});

module.exports = router;

