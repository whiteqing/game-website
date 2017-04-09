var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name: {
		uniqe: true,
		type: String
	},
	games: [{type: ObjectId, ref: 'Game'}],
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
CategorySchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
});

// 查找方法
CategorySchema.statics = {
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

module.exports = CategorySchema;