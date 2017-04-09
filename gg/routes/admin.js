var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var Game = mongoose.model('Game');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var _  = require('underscore');
var fs = require('fs');
var path = require('path');
var check = require('../middlewares/check');

var checkLogin = check.checkLogin;
var isAdmin = check.isAdmin;

// GET /admin 进入管理页
router.get('/', checkLogin, isAdmin, function(req, res, next) {
	res.render('admin', {
		title: '欢迎主人回家！！'
	});
});
// GET /admin/userlist 进入管理用户页
router.get('/userlist', checkLogin, isAdmin, function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count;

	User.fetch(function(err, users) {
		if(err) {console.log(err);}

		for(var i=0;i<users.length;i++) {
			if(users[i].username == '11111111') {
				users = users.splice(i+1);
			}
		}

		results = users.slice(index, index + count);
		res.render('adminuserlist', {
			title: '欢迎来到用户管理的地盘！！',
			currentPage: (page+1),
			totalPage: Math.ceil(users.length / count),
			users: results
		});
	});
});
// DELETE /admin/userlist 用户删除交互
router.delete('/userlist', checkLogin, isAdmin, function(req, res, next) {
	var id = req.query.id;
	if(id) {
        //删除用户，删除该用户发表的帖子还有一级评论，如果此用户发表过评论的，那么名字改成匿名用户
		User.remove({_id: id}, function(err, user) {
			if(err) {
                //失败
				console.log(err);
				res.json({success: 0});
			}else{
                //成功
                Post.remove({author:id},function(){
                    if(err) console.log(err);
                });
                Comment.remove({from:id}, function(){
                    if(err) console.log(err);
                })
				res.json({success: 1});
			}
		});
	}
});

// GET /admin/games 进入游戏管理页
router.get('/games', checkLogin, isAdmin, function(req, res, next) {
	res.render('admingames', {
		title: '游戏管理！！'
	});
});
// GET /admin/category/create 进入分类录入页
router.get('/category/create', checkLogin, isAdmin, function(req, res, next) {
	res.render('admincategorycreate', {
		title: '欢迎大大前来录入分类信息！',
		category: {}
	});
});

// POST /admin/category/create 分类录入
router.post('/category/create', checkLogin, isAdmin, function(req, res, next) {
	var id = req.fields.categoryId;
	var categoryName = req.fields.categoryName;
	var _category = {
		name: categoryName
	}
	Category.findOne({name:categoryName}, function(err, category){
		if(err) console.log(err);
		//已存在分类
		if(category){
			req.flash('error', '已经有此分类名！');
			if(id){
				return res.redirect('/admin/categoryupdate/'+id);
			}else{
				return res.redirect('/admin/category/create');
			}
		}else if(categoryName == ''){
			req.flash('error', '不能为空哦！');
			if(id){
				return res.redirect('/admin/categoryupdate/'+id);
			}else{
				return res.redirect('/admin/category/create');
			}

		}else{
			//修改分类
			if(id){
				Category.findById(id, function(err, category) {
					if(err) {console.log(err);}

					categoryLast = _.extend(category, _category);

					categoryLast.save(function(err, category) {
						if(err) {console.log(err);}

						res.redirect('/admin/categorylist');
					});
				});
			}else{
				//新增分类
				var category = new Category(_category);

				category.save(function(err, category) {
					if(err) {console.log(err);}

					res.redirect('/admin/categorylist');
				});
			}
		}
	})


	/*if(id) {
		//修改分类
		Category.findOne({name:categoryName}, function(err, category){
			console.log(1);
			if(err) console.log(err);
			//已存在分类
			if(category){
				console.log(category)
				req.flash('error', '已经有此分类名！');
				return res.redirect('/admin/categoryupdate/'+id);
			}else if(categoryName == ''){
				req.flash('error', '不能为空哦！');
				return res.redirect('/admin/categoryupdate/'+id);
			}else{
				Category.findById(id, function(err, category) {
					if(err) {console.log(err);}

					categoryLast = _.extend(category, _category);

					categoryLast.save(function(err, category) {
						if(err) {console.log(err);}

						res.redirect('/admin/categorylist');
					});
				});
			}
		})
	}else{
		//新建分类名不能为空
		if(categoryName == ''){
			req.flash('error', '不能为空哦！');
			return res.redirect('/admin/category/create');
		}else{
			//新建分类
			var category = new Category(_category);

			category.save(function(err, category) {
				if(err) {console.log(err);}

				res.redirect('/admin/categorylist');
			});
		}
	}	*/
});

// GET /admin/categorylist 进入分类列表页
router.get('/categorylist', checkLogin, isAdmin, function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count;

	Category.fetch(function(err, categories) {
		if(err) {console.log(err);}

		results = categories.slice(index, index + count);

		res.render('admincategorylist', {
			title: '分类列表展示给您观看！',
			currentPage: (page+1),
			totalPage: Math.ceil(categories.length / count),
			categories: results
		});
	});
});

// GET /admin/categoryupdate/:id 修改分类名称
router.get('/categoryupdate/:id', checkLogin, isAdmin, function(req, res, next) {
	var id = req.params.id;

	if (id) {
		Category.findById(id, function(err, category) {
			res.render('admincategorycreate', {
				title: '欢迎主人前来修改' + category.name,
				category: category
			});
		});
	}
});

// DELETE /admin/categorylist 分类删除交互
router.delete('/categorylist', checkLogin, isAdmin, function(req, res, next) {
	var id = req.query.id;
	if(id) {
		Category.findOne({_id:id}, function(err, category){
			if(category.games.length === 0 && !err){//分类下没有游戏才能删除
				category.remove(function(err){
					if(err){
						res.json({success: 0});
					}else{
						res.json({success: 1});
					}
				})
			}else if(category.games.length !== 0 && !err){
				res.json({success :0, mes: '该分类下有游戏，无法删除！'});
			}else{
				res.json({success: 1});
			}
		})
	}
});

// GET /admin/game/create 进入游戏录入页
router.get('/game/create', checkLogin, isAdmin, function(req, res, next) {
	Category.find({},function(err, categories){
		res.render('admingamecreate', {
			title: '欢迎大大前来录入游戏信息！',
			categories: categories,
			game: {}
		});
	});
});

// POST /admin/game/create 游戏录入
router.post('/game/create', checkLogin, isAdmin, function(req, res, next) {
	var gameId = req.fields.gameId;
	var gamecategory = req.fields.gamecategory;
	var gamename = req.fields.gamename;
	var gameposter = null;
	if(req.files.uploadposter.name) {
		gameposter = req.files.uploadposter.path.split(path.sep).pop();
	}else{
		fs.unlink(req.files.uploadposter.path);
		gameposter = req.fields.gameposter;
	}
	// var gameflash = req.fields.gameflash;
	var gameyear = req.fields.gameyear;
	var gameurl = req.fields.gameurl;
	var gamesummary = req.fields.gamesummary;

	var categoryId = req.fields.gamecategory;

	// 参数校验
	try {
		if (!gamename.length) {
		    throw new Error('游戏名称不能为空！');
		}
		if (!gameposter.length) {
			throw new Error('尚未上传海报！');
		}
		// if (!gameflash.length) {
		// 	throw new Error('尚未上传宣传视频！');
		// }
		if (!gameyear.length) {
			throw new Error('上线时间不能为空！');
		}
		if (!gamesummary.length) {
			throw new Error('游戏简介不能为空！');
		}
		if (!gameurl.length) {
			throw new Error('官网网站不能为空！');
		}
	} catch(e) {
		// 录入失败，异步删除上传的海报
	    fs.unlink(req.files.uploadposter.path);
	    req.flash('error', e.message);
	    return res.redirect('/admin/game/create');
	}

	var _game = {
		category: gamecategory,
		name: gamename,
		poster: gameposter,
		// flash: gameflash,
		year: gameyear,
		url: gameurl,
		summary: gamesummary
	}

	if(gameId) {
		Game.findById(gameId, function(err, game) {
			if(err) {console.log(err);}

			gameLast = _.extend(game, _game);

			gameLast.save(function(err, game) {
				if(err) {console.log(err);}

				res.redirect('/admin/gamelist');
			});
		});
	}else{
		Game.findOne({name: gamename}, function(err, game) {
			if(err) {console.log(err);}

			if(game != null) {
				req.flash('error', '已经录入过的游戏！');
				return res.redirect('/admin/game/create');
			}else{
				var game1 = new Game(_game);
				game1.save(function(err, game2) {
					if(err) {console.log(err);}
					if(categoryId) {
						Category.findById(categoryId, function(err, category) {

							category.games.push(game2._id);

							category.save(function(err, category) {
								res.redirect('/admin/gamelist');
							});
						});
					}
				});
			}
		});
	}
});


// GET /admin/game/edit 进入游戏修改页
router.get('/game/edit', checkLogin, isAdmin, function(req, res, next) {
	Category.find({},function(err, categories){
		res.render('admingameedit', {
			title: '修改游戏！',
			categories: categories,
			game: {}
		});
	});
});

// POST /admin/game/edit 游戏修改
router.post('/game/edit', checkLogin, isAdmin, function(req, res, next) {
	var gameId = req.fields.gameId;
	var gamecategory = req.fields.gamecategory;
	var gamename = req.fields.gamename;
	var gameposter = null;
	if(req.files.uploadposter.name) {
		gameposter = req.files.uploadposter.path.split(path.sep).pop();
	}else{
		fs.unlink(req.files.uploadposter.path);
		gameposter = req.fields.gameposter;
	}
	var gameflash = req.fields.gameflash;
	var gameyear = req.fields.gameyear;
	var gameurl = req.fields.gameurl;
	var gamesummary = req.fields.gamesummary;

	var categoryId = req.fields.gamecategory;

	// 参数校验
	try {
		if (!gamename.length) {
			throw new Error('游戏名称不能为空！');
		}
		if (!gameposter.length) {
			throw new Error('尚未上传海报！');
		}
		// if (!gameflash.length) {
		// 	throw new Error('尚未上传宣传视频！');
		// }
		if (!gameyear.length) {
			throw new Error('上线时间不能为空！');
		}
		if (!gamesummary.length) {
			throw new Error('游戏简介不能为空！');
		}
		if (!gameurl.length) {
			throw new Error('官网网站不能为空！');
		}
	} catch(e) {
		// 录入失败，异步删除上传的海报
		fs.unlink(req.files.uploadposter.path);
		req.flash('error', e.message);
		return res.redirect('/admin/gameupdate/'+gameId);
	}

	var _game = {
		category: gamecategory,
		name: gamename,
		poster: gameposter,
		// flash: gameflash,
		year: gameyear,
		url: gameurl,
		summary: gamesummary
	}

	if(gameId) {
		//查找游戏表中是否已存在输入的游戏
		Game.findOne({name: gamename}, function(err, game) {
			if(err) {console.log(err);}
			//通过id去游戏表中找要修改的那一条游戏的信息
			Game.findById(gameId, function(err, g) {
				if(err) {console.log(err);}
				//如果游戏表中此游戏已经存在而且不等于要修改的那一条游戏的名字
				if(game != null && g.name !=gamename) {
					req.flash('error','已经录入过的游戏！');
					return res.redirect('/admin/gameupdate/'+gameId);
				}else{
					//如果修改了分类，要把原来分类下games中的这个游戏的id删掉，再在新分类的games中增加一条这个游戏的id
					//新的分类表
					Category.findOne({_id:gamecategory}, function(err, category){
						category.games.push(gameId);
						category.save(function(err, category){
							if(err) console.log(err);
						});
					})
					//原来的分类表
					Category.findOne({_id:g.category}, function(err, category){
						for(var i=0; i<category.games.length; i++){
							if(category.games[i] ==gameId ){
								category.games.splice(i,1);
							}
						}
						category.save(function(err, category){
							if(err) console.log(err);
						});
					})
					gameLast = _.extend(g, _game);
					//保存进游戏表
					gameLast.save(function(err, game) {
						if(err) {console.log(err);}
						res.redirect('/admin/gamelist');
					});
				}
			})
			// if(game != null && game.name ==gamename) {
			// 	console.log(gameId);
			// 	req.flash('error','已经录入过的游戏！');
			// 	return res.redirect('/admin/gameupdate/'+gameId);
			// }else{
			// 	Game.findById(gameId, function(err, game) {
			// 		if(err) {console.log(err);}
            //
			// 		gameLast = _.extend(game, _game);
            //
			// 		gameLast.save(function(err, game) {
			// 			if(err) {console.log(err);}
            //
			// 			res.redirect('/admin/gamelist');
			// 		});
			// 	});
			// }
		})

	}
});

// GET /admin/gamelist 进入游戏列表页
router.get('/gamelist', checkLogin, isAdmin, function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;
	var count = 6;
	var index = page * count;

	Game.find({}).populate({path:'category', select:'name'}).exec(function(err, games){
		results = games.slice(index, index + count);

		res.render('admingamelist', {
			title: '游戏列表',
			currentPage: (page+1),
			totalPage: Math.ceil(games.length / count),
			games: results
		});
	})
});

// GET /admin/gameupdate/:id 修改游戏内容(点击修改)
router.get('/gameupdate/:id', checkLogin, isAdmin, function(req, res, next) {
	var id = req.params.id;
	if(id) {
		Game.findById(id, function(err, game) {
			Category.find({},function(err, categories){
				res.render('admingameedit', {
					title: '修改游戏',
					categories: categories,
					game: game
				});
			});
		});
	}
});

// DELETE /admin/gamelist 游戏删除交互
router.delete('/gamelist', checkLogin, isAdmin, function(req, res, next) {
	
	var id = req.query.id;//游戏id
	if(id) {
		Game.findOne({_id:id}, function(err, game){
			//$pull   删除一条
			Category.update({_id: game.category},{'$pull':{'games':id}}, {$inc:{'__v':-1}},function(err, category){
				game.remove(function(err){
					if(err) {
						console.log(err);
						res.json({success: 0});
					}else{
						res.json({success: 1});
					}
				})
			})
		});
	}
});

// GET /admin/postlist 进入帖子列表页
router.get('/postlist', checkLogin, isAdmin, function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;//点击了第几页
	var count = 8;//每页显示帖子条数
	var index = page * count;//总共要拿到多少条数据

	Post
		.find({})
		.populate({
	  	  path: 'author',
	  	  model: 'User'
		})
		.exec(function(err, posts) {
		if(err) {console.log(err);}

		results = posts.slice(index, index + count);

		res.render('adminpostlist', {
			title: '帖子列表展示给您观看！',
			currentPage: (page+1),
			totalPage: Math.ceil(posts.length / count),
			posts: results
		});
	});
});

// DELETE /admin/postlist 帖子删除交互
router.delete('/postlist', checkLogin, isAdmin, function(req, res, next) {
	var id = req.query.id;
	if(id) {
		//删除帖子
		Post.remove({_id: id}, function(err, post) {
			if(err) {
				console.log(err);
				res.json({success: 0});
			}else{
				//删除该帖子下的所有评论
				Comment.remove({postId:id}, function(err, comment){
					if(err){
						console.log(err);
						res.json({success: 0});
					}else{
						res.json({success: 1});
					}
				})
			}
		});

	}
});

module.exports = router;