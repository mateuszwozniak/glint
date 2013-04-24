'use strict';

var cleanCss = require('clean-css');

module.exports = function (content, options) {
    options = options || {};
    return cleanCss.process(content, options);
};

