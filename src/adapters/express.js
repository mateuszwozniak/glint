'use strict';

var path = require('path');
var fs = require('fs');
var FsNotifier = require('fs.notify');

module.exports = function (manifestPath) {
    if (manifestPath[0] !== '/') {
        manifestPath = path.normalize(path.join(process.cwd(), manifestPath));
    }

    var assets;
    var htmlAssets;

    initAssets();
    watchForManifestChanges();

    function initAssets() {
        assets = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        initHtmlAssets();
    }

    function initHtmlAssets() {
        htmlAssets = {
            dev: {},
            prod: {}
        };

        Object.keys(assets.dev).forEach(function (pkgName) {
            htmlAssets.dev[pkgName] = createPackageHtmls(assets.dev[pkgName]);
        });

        Object.keys(assets.prod).forEach(function (pkgName) {
            htmlAssets.prod[pkgName] = createPackageHtmls(assets.prod[pkgName]);
        });
    }

    function watchForManifestChanges() {
        var notifier = new FsNotifier([manifestPath]);
        notifier.on('change', initAssets);
    }

    function injectAssets(req, res, next) {
        if (req.query.debugGlintAssets) {
            res.locals.assets = htmlAssets.dev;
        } else {
            res.locals.assets = htmlAssets.prod;
        }
        next();
    }

    return injectAssets;
};

function createPackageHtmls(pkg) {
    var output = {
        css: createCssAssets(pkg.css),
        js: createJsAssets(pkg.js)
    };
    return output;
}

function createCssAssets(files) {
    if (!Array.isArray(files)) {
        files = [files];
    }

    var output = files.map(function createLinkNode(file) {
        return '<link type="text/css" rel="stylesheet" href="/' + file + '" />';
    });
    return output.join('\n');
}

function createJsAssets(files) {
    if (!Array.isArray(files)) {
        files = [files];
    }

    var output = files.map(function createLinkNode(file) {
        return '<script type="text/javascript" src="/' + file + '"></script>';
    });
    return output.join('\n');
}
