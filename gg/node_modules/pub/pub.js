// tpl - a general purpose template cli
// (c) 2011 Paul Vorbach. Licensed under MIT.
;(function() {

var fs = require('fs');
var path = require('path');

var append = require('append');
var confdir = require('confdir');

module.exports = function (cb) {
  confdir(process.cwd(), 'tpl', function(err, dir) {
    if (err)
      cb(err);
    else
      cb(null, {
        add: exp('add', dir),
        rm:  exp('rm', dir)
      });
  });
};

// exports a command
function exp(cmd, confdir) {
  return function (files, opt) {
    var defaultOpt = {
      cwd: process.cwd()
    };
    opt = append(defaultOpt, opt);

    if (typeof files == 'string')
      files = [ files ];

    require(path.resolve(confdir, cmd + '.js'))(files, opt);
  };
};

}).call(this);
