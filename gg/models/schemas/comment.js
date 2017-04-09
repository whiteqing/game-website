var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	postId: {
		type: ObjectId,
		ref: 'Post'
	},
	gameId: {
		type: ObjectId,
		ref: 'Game'
	},
	content: String,
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from: {
			type: ObjectId,
			ref: 'User'
		},
		to: {
			type: ObjectId,
			ref: 'User'
		},
		content: String
	}],
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

// 留言保存
CommentSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
});

// 查找方法
CommentSchema.statics = {
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

module.exports = CommentSchema;