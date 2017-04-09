var mongoose = require('mongoose');
var GameSchema = require('./schemas/game');
var Game = mongoose.model('Game', GameSchema);

module.exports = Game;