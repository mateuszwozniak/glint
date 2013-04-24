var chai = require('chai');
global.expect = chai.expect;
var fsx = require('fs-extra');

before(function () {
    removeOutputDirectories();
});
after(function () {
    removeOutputDirectories();
});

function removeOutputDirectories() {
    fsx.removeSync('./test/fixtures/output/build');
    fsx.removeSync('./test/fixtures/output/sources');
    fsx.removeSync('./test/fixtures/output/manifest.json');
}