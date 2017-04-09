// 验证是否登陆或是否是管理员
module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		if (!req.session.user) {
      		return res.redirect('/signinerror');
    	}
    	next();
  	},
  	checkNotLogin: function checkNotLogin(req, res, next) {
  		if (req.session.user) {
  			return res.redirect('/');
  		}
  		next();
  	},
  	isAdmin: function isAdmin(req, res, next) {
		var _user = req.session.user;
		var role = _user.role;
		if(role < 10) {
			return res.redirect('/adminerror');
		}
		next();
	}
};