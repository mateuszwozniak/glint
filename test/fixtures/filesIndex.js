var path = require('path');
var cwd = process.cwd();

var index = {};
index[path.join(cwd, "test/fixtures/assets/template.jade")] = [ "gallery" ];
index[path.join(cwd, "test/fixtures/assets/styles.styl")] = [ "gallery" ];
index[path.join(cwd, "test/fixtures/assets/gallery.js")] = [ "gallery" ];
index[path.join(cwd, "test/fixtures/assets/gallery.css")] = [ "gallery" ];

module.exports = index;
