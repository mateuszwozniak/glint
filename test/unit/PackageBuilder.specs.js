'use strict';

var PackageBuilder = require('../../src/PackageBuilder');
var parsedPackages = require('../fixtures/parsedPackages');
var finalPackages = require('../fixtures/finalPackages');

describe('PackageBuilder', function () {

    it('should build final packages with its dependencies', function () {
        var packageBuilder = new PackageBuilder(parsedPackages);
        packageBuilder.build();
        var builtPackages = packageBuilder.getPackages();
        expect(builtPackages).to.deep.equal(finalPackages);
    });
});
