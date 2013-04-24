var preprocessors = require('../../').preprocessors;
var jade = preprocessors.jade;
var stylus = preprocessors.stylus;

var postprocessors = require('../../').postprocessors;
var cleanCss = postprocessors['clean-css'];
var uglifyJs = postprocessors['uglify-js'];

module.exports = {
    assetsDir: 'assets',
    outputDir: 'output',
    manifest: 'output/manifest.json',
    preprocessors: {
        styl: stylus,
        jade: jade
    },
    postprocessors: {
        css: [cleanCss],
        js: [uglifyJs]
    },
    packages: [
        {
            name: 'core',
            final: false,
            files: [
                'file1.js',
                'file2.js'
            ]
        },
        {
            name: 'gallery',
            final: true,
            require: ['templates'],
            files: [
                'gallery.js',
                'gallery.css'
            ]
        },
        {
            name: 'templates',
            final: false,
            files: [
                'template.jade',
                'styles.styl'
            ]
        }
    ]
};