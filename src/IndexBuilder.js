'use strict';

module.exports = IndexBuilder;

function IndexBuilder(packages) {
    var index = {};
    var files = [];

    this.getIndex = function () {
        return index;
    };

    this.getFileList = function () {
        return files;
    };

    this.build = function () {
        packages.forEach(buildDependenciesForPackage);
        packages.forEach(storePackageFiles);
    };

    function buildDependenciesForPackage(pkg) {
        var packageFiles = pkg.files;
        var packageName = pkg.name;

        for (var i = 0, fCount = packageFiles.length; i < fCount; i++) {
            addDependency(packageFiles[i], packageName);
        }
    }

    function addDependency(key, packageName) {
        if (!index.hasOwnProperty(key)) {
            index[key] = [];
        }

        if (index[key].indexOf(packageName) === -1) {
            index[key].push(packageName);
        }
    }

    function storePackageFiles(pkg) {
        var packageFiles = pkg.files;
        for (var i = 0, len = packageFiles.length; i < len; i++) {
            if (files.indexOf(packageFiles[i]) === -1) {
                files.push(packageFiles[i]);
            }
        }
    }

}
