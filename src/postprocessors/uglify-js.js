'use strict';

var uglify = require('uglify-js');

module.exports = function (content, options) {
    options = options || {};
    options.fromString = true;

    return uglify.minify(content, options).code;
};