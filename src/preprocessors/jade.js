'use strict';

var path = require('path');
var jade = require('jade');

function Jade(filePath, content, options, cb) {
    var fileName = path.basename(filePath);
    var name = fileName.substr(0, fileName.lastIndexOf('.'));

    options = options || {};
    options.client = true;
    options.filename = name;

    var output;
    try {
        output = jade.compile(content, options).toString();
    } catch (ex) {
        console.log('[ERROR] Jade processing failed, file:', filePath, ex);
        process.exit(-1);
    }

    output = output.replace('anonymous', name);
    output = 'window.jade.' + name + ' = ' + output;
    cb(null, output);
}

Jade.outputExtension = 'js';

module.exports = Jade;