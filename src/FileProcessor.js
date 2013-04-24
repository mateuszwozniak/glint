'use strict';
module.exports = FileProcessor;

var fs = require('fs');
var path = require('path');

function FileProcessor(files, config) {
    var filesCount = files.length;
    var doneCallback = function () {};
    var readyFiles = 0;
    var processedFiles = {};

    this.getProcessedFiles = function () {
        return processedFiles;
    };

    this.process = function (done) {
        doneCallback = done;
        files.forEach(processFile);
    };

    this.processFile = processFile;

    function processFile(file, cb) {
        var preprocessors = config.preprocessors;
        var fileContent = fs.readFileSync(file, 'utf-8');
        var extension = file.split('.').pop();
        if (preprocessors.hasOwnProperty(extension)) {
            processWithProcessor(file, fileContent, preprocessors[extension], cb);
        } else {
            storeProcessedFile(fileContent, file);
            typeof cb === 'function' && cb();
        }
    }

    function storeProcessedFile(content, filePath, outputExtension) {
        var newFileName = path.basename(filePath);
        var extension = newFileName.split('.').pop();
        if (outputExtension && (extension !== outputExtension)) {
            newFileName += '.' + outputExtension;
            extension = outputExtension;
        }

        processedFiles[filePath] = {
            content: content,
            name: newFileName,
            extension: extension
        };

        readyFiles++;

        if (readyFiles === filesCount) {
            doneCallback();
        }
    }

    function processWithProcessor(filePath, fileContent, processor, cb) {
        var processorFn;
        var processorOptions = {};

        if (typeof processor === 'function') {
            processorFn = processor;
        } else if (processor.fn === 'function') {
            processorFn = processor.fn;
            processorOptions = processor.options || {};
        } else {
            throw new Error('Can not use preprocessor because it is not callable:', processor);
        }

        processorFn(filePath, fileContent, processorOptions, function (err, output) {
            if (err) {
                console.log('[ERROR] Preprocessing error', err);
                process.exit(-1);
            }

            storeProcessedFile(output, filePath, processor.outputExtension);
            typeof cb === 'function' && cb();
        });
    }
}