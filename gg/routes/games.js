var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Category = mongoose.model('Category');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /games 进入游戏列表页
router.get('/', checkLogin, function(req, res, next) {
	Category
		.find({})
		.populate({
			path: 'games',
			select: 'name poster url',
			options: { limit: 6}
		})
		.exec(function(err, categories) {
			if(err) {console.log(err);}

			res.render('games', {
				title: '万千游戏控，总有一款适合你！',
				categories: categories
			});
		});
});

// GET /games/:id 进入游戏详情页
router.get('/:id', checkLogin, function(req, res, next) {
	var id = req.params.id;

	Game
	  .findOne({_id: id})
	  .populate({
	  	  path: 'category',
	  	  model: 'Category'
	  })
	  .exec(function(err, game) {
	  	res.render('gamedetail', {
			title: 'lalalla',
			game: game
		});
	  });
});


module.exports = router;