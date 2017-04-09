var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// 发表模型
var PostSchema = new Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},
	title: String,
	content: String,
	pv: Number,
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

// 发表保存
PostSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now()
	}
  next();
});

// 查找方法
PostSchema.statics = {
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

module.exports = PostSchema;