'use strict';

var sass = require('node-sass');

function Sass(filePath, content, options, cb) {
    sass.render(content, function (err, css) {
        cb(err, css);
    }, options || {});
}

Sass.outputExtension = 'css';
module.exports = Sass;

