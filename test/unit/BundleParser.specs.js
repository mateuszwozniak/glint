'use strict';

var path = require('path');
var cwd = process.cwd();

var config = require('../fixtures/config');
var configDir = path.join(cwd, 'test/fixtures');
var assetsPath = path.join(configDir, config.assetsDir);
config.assetsDir = path.normalize(assetsPath);
var originalPackages = config.packages;

var BundleParser = require('../../src/BundleParser');
var parsedPackages = require('../fixtures/parsedPackages');

describe('BundleParser', function () {

    it('should throw error when file from package does not exists', function () {
        config.packages = [{name: 'test', files: ['someNonExistingFile.js']}];
        var bp = new BundleParser(config.packages, config.assetsDir);
        expect(function () {
            bp.parse();
        }).to.throw(Error);
    });

    it('should update files paths in packages to absolute paths', function () {
        config.packages = originalPackages;
        var bp = new BundleParser(config.packages, config.assetsDir);
        bp.parse();
        expect(config.packages).to.deep.equal(parsedPackages);
    });

});