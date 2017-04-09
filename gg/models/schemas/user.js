var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR =10;
var Schema = mongoose.Schema;

// 用户模型
var UserSchema = new Schema({
	username: {
		uniqe: true,
		type: String
	},
	password: String,
	//昵称 用于显示
	nickname: {
		uniqe: true,
		type: String
	},
	gender: {
		type: String,
		enum: ['m','f','x']
	},
	age: Number,
	constellation: {
		type: String,
		enum: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
		'Sagittarius','Capricorn','Aquarius','Pisces']
	},
	avatar: String,
	bio: String,
	// 权限 role > 10为管理员
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
		  type: Date,
		  default: Date.now()
		},
		updateAt: {
		  type: Date,
		  default: Date.now()
		}
	}
});
// 注册保存方法
UserSchema.pre('save', function(next) {
	var user = this;
	// 创建修改时间
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	// 密码加盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});
});

// 密码比较
UserSchema.methods = {
	comparePassword: function(_password, callback) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if(err) return callback(err);

			callback(null, isMatch);
		});
	}
}
// 查找方法
UserSchema.statics = {
  fetch: function(callback) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(callback)
  },
  findById: function(id, callback) {
    return this
      .findOne({_id: id})
      .exec(callback)
  }
}


module.exports = UserSchema;