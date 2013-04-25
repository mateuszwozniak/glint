'use strict';
module.exports = Glint;

var FsNotifier = require('fs.notify');

var PackageBuilder = require('./PackageBuilder');
var BundleParser = require('./BundleParser');
var IndexBuilder = require('./IndexBuilder');
var FileProcessor = require('./FileProcessor');
var PackageWriter = require('./PackageWriter');

function Glint(config) {
    if (config.dev) {
        console.log('[INFO] Running in development mode');
    }

    var packageWriter;
    var processedFiles;
    var fileProcessor;
    var finalPackages;
    var files;
    var index;

    this.run = run;

    function run() {
        console.log('[INFO] Parsing packages');
        var bundleParser = new BundleParser(config.packages, config.assetsDir);
        bundleParser.parse();

        console.log('[INFO] Building target packages');
        var packageBuilder = new PackageBuilder(config.packages);
        packageBuilder.build();
        finalPackages = packageBuilder.getPackages();

        console.log('[INFO] Building file indexes');
        var indexBuilder = new IndexBuilder(finalPackages);
        indexBuilder.build();
        index = indexBuilder.getIndex();
        files = indexBuilder.getFileList();

        console.log('[INFO] Processing files');
        fileProcessor = new FileProcessor(files, config);
        fileProcessor.process(writePackages);
    }

    function writePackages() {
        console.log('[INFO] Writing packages');
        processedFiles = fileProcessor.getProcessedFiles();
        packageWriter = new PackageWriter(finalPackages, processedFiles, config);
        packageWriter.writeFiles();
        packageWriter.writePackages();
        packageWriter.writeManifest();

        if (config.watch) {
            console.log('[INFO] Watching for file changes...');
            var notifier = new FsNotifier(files);
            notifier.on('change', fileChanged);
        }
    }

    function fileChanged(filePath) {
        console.log('[INFO] File changed:', filePath);
        fileProcessor.processFile(filePath, updatePackagesForChangedFile);

        function updatePackagesForChangedFile() {
            packageWriter.writeFile(filePath);

            var packagesWithChangedFile = index[filePath];

            // save only js or css bundle
            var extensionToWrite = {};
            if (processedFiles[filePath].name.split('.').pop() === 'js') {
                extensionToWrite.js = true;
            } else {
                extensionToWrite.css = true;
            }

            if (packagesWithChangedFile) {
                packageWriter.writePackages(packagesWithChangedFile, extensionToWrite);
                packageWriter.writeManifest();
            }
        }
    }

}