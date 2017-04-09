var mongoose = require('mongoose');
var PostSchema = require('./schemas/post');
var Post = mongoose.model('Post', PostSchema);

module.exports = Post;