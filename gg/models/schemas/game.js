var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var GameSchema = new Schema({
	name: {
		uniqe: true,
		type: String
	},
	poster: String,
	// flash: String,
	year: String,
	url: String,
	summary: String,
	category: {
		type: ObjectId,
		ref: 'Category'
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

// 游戏保存
GameSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
});

// 查找方法
GameSchema.statics = {
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

module.exports = GameSchema;