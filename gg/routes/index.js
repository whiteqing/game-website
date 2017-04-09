//入口
module.exports = function(app) {

	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user;
		var _error = req.flash('error').toString();
		app.locals.error = _error;
		next();
	});

	app.get('/', function(req, res, next) {
		res.render('index', {
			title: '首页！',
		});

		next();
	});

	// 注册
	app.use('/signup', require('./signup'));
	// 登录
	app.use('/signin', require('./signin'));
	// 登出
	app.use('/signout', require('./signout'));
	// 用户信息
	app.use('/user', require('./user'));
	// 游戏
	app.use('/games', require('./games'));
	// 论坛
	app.use('/posts', require('./posts'));
	// 关于
	app.get('/about', function(req, res, next) {
		res.render('about', {
			title: '关于本站'
		});

	});
	// 搜索
	app.use('/search', require('./search'));

	// 管理员页面
	app.use('/admin', require('./admin'));

	// 请求失败，转入请求登录页面
	app.get('/signinerror', function(req, res, next) {
		res.render('signinerror', {
			title: '登陆'
		});

	});
	// 请求失败，转入不是管理员页面
	app.get('/adminerror', function(req, res, next) {
		res.render('adminerror', {
			title: '不要太跳哦，你不是管理员！！'
		});

	});
}