/**
 * @todo move merging and postprocessing outside PackageWriter - it's not its responsibility
 */
'use strict';

module.exports = PackageWriter;

var path = require('path');
var fs = require('fs');
var createHash = require('crypto').createHash;
var fsx = require('fs-extra');

function PackageWriter(packages, processedFiles, config) {
    var manifest = {dev: {}, prod: {}};
    initDirectoryStructure();

    function initDirectoryStructure() {
        removeOldDirectories();
        createNewDirectories();
    }

    function removeOldDirectories() {
        fsx.removeSync(path.join(config.outputDir, 'sources/css'));
        fsx.removeSync(path.join(config.outputDir, 'sources/js'));
        fsx.removeSync(path.join(config.outputDir, 'build/css'));
        fsx.removeSync(path.join(config.outputDir, 'build/js'));
    }

    function createNewDirectories() {
        fsx.mkdirsSync(path.join(config.outputDir, 'sources/css'));
        fsx.mkdirsSync(path.join(config.outputDir, 'sources/js'));
        fsx.mkdirsSync(path.join(config.outputDir, 'build/css'));
        fsx.mkdirsSync(path.join(config.outputDir, 'build/js'));
    }

    this.writeManifest = function () {
        updateDevPackagesInManifest();
        if (config.dev) {
            manifest.prod = manifest.dev;
        }
        var pth = path.join(config.baseDir, config.manifest);
        fsx.writeJsonSync(pth, manifest);
    };

    function updateDevPackagesInManifest() {
        packages.forEach(function (pkg) {
            var files = splitPackageFiles(pkg);
            manifest.dev[pkg.name] = {
                css: getPathsForFiles(files.css),
                js: getPathsForFiles(files.js)
            };
        });
    }

    function getPathsForFiles(files) {
        return files.map(function (originalFilePath) {
            var outputFile = processedFiles[originalFilePath];
            return path.relative(config.outputDir, createDevFilePath(outputFile.name, outputFile.extension));
        });
    }

    this.writeFiles = function () {
        Object.keys(processedFiles).forEach(writeFile);
    };

    this.writeFile = writeFile;

    function writeFile(originalFilePath) {
        var outputFile = processedFiles[originalFilePath];
        var outputPath = createDevFilePath(outputFile.name, outputFile.extension);
        fs.writeFileSync(outputPath, outputFile.content, 'utf-8');
    }

    function createDevFilePath(name, extension) {
        return path.join(config.outputDir, 'sources', extension, name);
    }

    this.writePackages = function (packageNames, fileTypes) {
        if (config.dev) {
            return;
        }

        var packagesToWrite = getPackagesToWrite(packageNames);
        var fileTypesToWrite = fileTypes || {js: true, css: true};

        packagesToWrite.forEach(function (pkg) {
            writePackage(pkg, fileTypesToWrite);
        });
    };

    function getPackagesToWrite(packageNames) {
        if (packageNames) {
            return packages.filter(function (pkg) {
                return packageNames.indexOf(pkg.name) !== -1;
            });
        }
        return packages;
    }

    function writePackage(pkg, extensions) {
        var packageFiles = splitPackageFiles(pkg);
        var css = mergeFiles(packageFiles.css);
        var js = mergeFiles(packageFiles.js, ';');

        css = postProcess(css, 'css');
        js = postProcess(js, 'js');

        manifest.prod[pkg.name] = manifest.prod[pkg.name] || {};
        if (extensions.css) {
            writePackageFile(pkg.name, css, 'css');
        }
        if (extensions.js) {
            writePackageFile(pkg.name, js, 'js');
        }
        console.log('[INFO] Package', pkg.name, 'written.');
    }

    function splitPackageFiles(pkg) {
        var css = [];
        var js = [];
        var files = pkg.files;

        for (var i = 0, len = files.length; i < len; i++) {
            if (processedFiles[files[i]].extension === 'css') {
                css.push(files[i]);
            } else {
                js.push(files[i]);
            }
        }

        return {
            css: css,
            js: js
        };
    }

    function mergeFiles(files, separator) {
        var output = [];
        for (var i = 0, len = files.length; i < len; i++) {
            output.push(processedFiles[files[i]].content);
        }

        return output.join(separator || '\n');
    }

    function writePackageFile(packageName, content, type) {
        var filePath = createProdFilePath(packageName, type, createHashForContent(content));
        manifest.prod[packageName][type] = path.relative(config.outputDir, filePath);
        fs.writeFileSync(filePath, content, 'utf-8');
    }

    function createProdFilePath(packageName, extension, hash) {
        var fileName = [packageName, hash, extension].join('.');
        var filePath = path.join(config.outputDir, 'build', extension, fileName);
        return filePath;
    }


    function postProcess(content, category) {
        var processors = config.postprocessors[category];
        if (!processors) {
            return content;
        }

        processors.forEach(function processContent(postprocessor) {
            if (typeof postprocessor === 'function') {
                content = postprocessor(content, {});
            } else if (typeof postprocessor === 'object' && postprocessor.fn === 'function') {
                var options = postprocessor.options || {};
                postprocessor.fn(content, postprocessor, options);
            } else {
                console.log('[WARNING] Can not use postprocessor: ', postprocessor, '(' + category + ')');
            }
        });

        return content;
    }

    function createHashForContent(content) {
        return createHash('md5').update(content).digest('hex')
    }
}