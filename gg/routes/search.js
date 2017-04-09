var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Category = mongoose.model('Category');
var Post = mongoose.model('Post');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /search/games 进入游戏搜索结果页
router.get('/games', checkLogin, function(req, res, next) {
	var categoryName = req.query.category;
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 5;
	var index = page * count;

	if(categoryName) {
		Category
		  .find({name: categoryName})
		  .populate({
		  	path: 'games',
		  	select: 'name poster url'
		  })
		  .exec(function(err, categories) {
		  	if(err) {console.log(err);}

		  	var category = categories[0] || {};
		  	var games = category.games || [];
		  	var results = games.slice(index, index + count);

		  	res.render('searchgame', {
		  		title: '诺，你想要的' + categoryName,
		  		keyword: category.name,
		  		currentPage: (page + 1),
		  		query: 'category=' + categoryName,
		  		totalPage: Math.ceil(games.length / count),
		  		games: results
		  	});
		  });
	}else{
		console.log('走这里');
		Game
		  .find({name: new RegExp(q + '.*', 'i')})
		  .exec(function(err, games) {
		  	if(err) {console.log(err);}

		  	var results = games.slice(index, index + count);

		  	res.render('searchgame', {
		  		title: '找到你想要的了吗！',
		  		keyword: q,
		  		currentPage: (page + 1),
		  		query: 'q=' + q,
		  		totalPage: Math.ceil(games.length / count),
		  		games: results
		  	});
		  });
	}
});

// GET /search/posts 进入帖子搜索结果页
router.get('/posts', checkLogin, function(req, res, next) {
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count;

	Post
	  .find({title: new RegExp(q + '.*', 'i')})
	  .populate({path: 'author', model: 'User'})
	  .exec(function(err, posts) {
	  	if(err) {console.log(err);}

	  	// 冒泡排序 完成帖子点击量排序
	  	var sortPosts = function(array) {
	  		var i,j,temp;

	  		for(i = 0; i < array.length; i++) {
	  			for(j = i + 1; j < array.length; j++) {
	  				if(array[j].pv > array[i].pv) {
	  					temp = array[i];
	  					array[i] = array[j];
	  					array[j] = temp;
	  				}else if(array[j].pv === array[i].pv) {
	  					if(array[j].meta.updateAt > array[i].meta.updateAt) {
	  						temp = array[i];
	  						array[i] = array[j];
	  						array[j] = temp;
	  					}
	  				}
	  			}
	  		}
	  		return array;
	  	}

 		sortPosts(posts);

	  	var results = posts.slice(index, index + count);

	  	res.render('searchpost', {
	  		title: '找到你想要的了吗！',
	  		keyword: q,
	  		currentPage: (page + 1),
	  		query: 'q=' + q,
	  		totalPage: Math.ceil(posts.length / count),
	  		posts: results
	  	});
	  });
});
module.exports = router;