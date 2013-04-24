var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var cwd = process.cwd();
var manifestPath = path.join(cwd, 'test/fixtures/output/manifest.json');
var expectedManifestContent = require('../fixtures/manifestContent');

before(function (done) {
    var glint = child_process.exec('./bin/glint -c test/fixtures/config.js', function (err, stdout, stderr) {
        if (err) {
            throw err;
        }
    });
    glint.on('exit', function () {
        done();
    });
});

describe('E2E: create packages', function () {

    it('should write manifest file', function () {
        expect(fs.existsSync(manifestPath)).to.be.true;
    });

    it('manifest should have correct content', function () {
        var manifest = getManifestContent();
        expect(manifest.dev).to.deep.equal(expectedManifestContent.dev);
        expect(manifest.prod.gallery.js).to.match(expectedManifestContent.prod.gallery.js);
        expect(manifest.prod.gallery.css).to.match(expectedManifestContent.prod.gallery.css);
    });

    it('should write files embeded in manifest', function () {
        var manifest = getManifestContent();
        expect(fs.existsSync(createOutputFilePath(manifest.dev.gallery.css[0])));
        expect(fs.existsSync(createOutputFilePath(manifest.dev.gallery.css[1])));
        expect(fs.existsSync(createOutputFilePath(manifest.dev.gallery.js[0])));
        expect(fs.existsSync(createOutputFilePath(manifest.dev.gallery.js[1])));
        expect(fs.existsSync(createOutputFilePath(manifest.prod.gallery.js)));
        expect(fs.existsSync(createOutputFilePath(manifest.prod.gallery.css)));
    });

    it('should save sources as separate processed files', function () {
        var file;
        var fname;
        var expectedFileContent;
        var processedFileContent;
        var manifest = getManifestContent();

        file = manifest.dev.gallery.css[0];
        fname = file.split('/').pop();
        var expectedFileContent = getExpectedFileContent(fname);
        var processedFileContent = getFileContent(createOutputFilePath(file));
        expect(processedFileContent).to.equal(expectedFileContent);

        file = manifest.dev.gallery.css[1];
        fname = file.split('/').pop();
        expectedFileContent = getExpectedFileContent(fname);
        processedFileContent = getFileContent(createOutputFilePath(file));
        expect(processedFileContent).to.equal(expectedFileContent);

        file = manifest.dev.gallery.js[0];
        fname = file.split('/').pop();
        expectedFileContent = getExpectedFileContent(fname);
        processedFileContent = getFileContent(createOutputFilePath(file));
        expect(processedFileContent).to.equal(expectedFileContent);

        file = manifest.dev.gallery.js[1];
        fname = file.split('/').pop();
        expectedFileContent = getExpectedFileContent(fname);
        processedFileContent = getFileContent(createOutputFilePath(file));
        expect(processedFileContent).to.equal(expectedFileContent);
    });

    it('should save processed files with correct content', function () {
        var expectedFileContent;
        var processedFileContent;
        var manifest = getManifestContent();

        expectedFileContent = getExpectedFileContent('gallery.package.css');
        processedFileContent = getFileContent(createOutputFilePath(manifest.prod.gallery.css));
        expect(processedFileContent).to.equal(expectedFileContent);

        expectedFileContent = getExpectedFileContent('gallery.package.js');
        processedFileContent = getFileContent(createOutputFilePath(manifest.prod.gallery.js));
        expect(processedFileContent).to.equal(expectedFileContent);
    });
});

function getManifestContent() {
    var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return manifest;
}

function createOutputFilePath(pth) {
    return path.join(cwd, 'test/fixtures/output', pth);
}

function getExpectedFileContent(fname) {
    var path = createExpectedFilePath(fname);
    return getFileContent(path);
}

function getFileContent(fpath) {
    return fs.readFileSync(fpath, 'utf-8');
}

function createExpectedFilePath(fname) {
    return path.join(cwd, 'test/fixtures/processedAssets', fname);
}

