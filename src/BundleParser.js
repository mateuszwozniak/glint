'use strict';
module.exports = BundleParser;

var fs = require('fs');
var path = require('path');

function BundleParser(rawBundle, assetsDir) {

    this.parse = function () {
        updateFilesPaths();
        checkFiles();
    };

    function updateFilesPaths() {
        rawBundle.forEach(updateFilesPathsInPackage);
    }

    function updateFilesPathsInPackage(pkg) {
        var files = pkg.files.map(function updateFilePath(filePath) {
            var pth = path.join(assetsDir, filePath);
            return path.normalize(pth);
        });
        pkg.files = files;
    }

    function checkFiles() {
        var fileChecker = new FileChecker(rawBundle);
        if (!fileChecker.check()) {
            throw new Error('File : ' + fileChecker.getLastFailedFile() + 'does not exists!');
        }
    }
}

function FileChecker(packages) {
    var lastFailedFile;

    this.getLastFailedFile = function () {
        return lastFailedFile;
    };

    this.check = function () {
        return packages.every(checkFilesFromPackage);
    };

    function checkFilesFromPackage(pkg) {
        var files = pkg.files;

        for (var i = 0, len = files.length; i < len; i++) {
            if (!fs.existsSync(files[i])) {
                lastFailedFile = files[i];
                return false;
            }
        }

        return true;
    }
}

