'use strict';

var IndexBuilder = require('../../src/IndexBuilder');
var finalPackages = require('../fixtures/finalPackages');
var filesIndex = require('../fixtures/filesIndex');
var filesList = require('../fixtures/filesList');

describe('IndexBuilder', function () {

    it('should build index with package names for each file', function () {
        var indexBuilder = new IndexBuilder(finalPackages);
        indexBuilder.build();
        var index = indexBuilder.getIndex();
        expect(index).to.deep.equal(filesIndex);
    });

    it('should build list with all files to watch', function () {
        var indexBuilder = new IndexBuilder(finalPackages);
        indexBuilder.build();
        var files = indexBuilder.getFileList();
        expect(files).to.deep.equal(filesList);
    });

});
