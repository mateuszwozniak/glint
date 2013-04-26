'use strict';

var sass = require('node-sass');

function Scss(filePath, content, options, cb) {
    sass.render(content, function (err, css) {
        cb(err, css);
    }, options || {});
}

Scss.outputExtension = 'css';
module.exports = Scss;

