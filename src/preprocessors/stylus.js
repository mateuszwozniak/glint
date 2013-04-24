'use strict';

var stylus = require('stylus');
var nib = require('nib');
var path = require('path');

function Stylus(filePath, content, options, cb) {
    var styl = stylus(content)
        .set('filename', filePath)
        .use(nib())
        .import('nib');

    if (options.url) {
        styl.define('url', stylus.url({ paths: options.url }));
    }

    styl.render(function (err, css) {
        if (err) {
            console.log('[ERROR] Stylus processing error: ', err);
            process.exit(-1);
        }
        cb(null, css);
    });
}

Stylus.outputExtension = 'css';

module.exports = Stylus;