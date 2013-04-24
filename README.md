#Glint
Glint is an asset (css, js, whatever-you-need) management tool for your project.
It helps you better organize files you serve to browser, as well as process them with any processor you need, even with your own one.

For now it works with express.js but you can simply adjust it to your project and technology.

##Features:
- creating named 'packages' from your assets (e.g. jquery-ui, my-tools, etc.)
- merging, processing, compressing files for production environment
- generating separate files for development process
- watching for changes and rebuilding suitable packages
- switching between merged, compressed files and separate files with query parameter (in express.js)
- support for jade and stylus (more in progress)

##How it works:
1. Create config file with packages (or simply files) you want to serve to your application
2. Specify output directory in config
3. Specify preprocessors (optional) and postprocessors (optional)
4. Run glint
5. Inject created packages to your project.

##How to do that:
###Installation
```javascript
npm install glint
```
###Creating config file
```javascript

module.exports = {
    /** directory with files you want to use in your project (relative path to this file) */
    assetsDir: 'assets',
    /** directory where processed files will be saved (relative path to this file) */
    outputDir: 'output',
    /** path to file with information about generated packages (relative path to this file) */
    manifest: 'output/manifest.json',
    /** preprocessors you want to use (explained below) */
    preprocessors: {},
    /** postprocessors you want to use (explained below) */
    postprocessors: {},

    /** definitions with your packages */
    packages: [
        {
            /** package name - you can use it as requirement for another package */
            name: 'core',
            /** generate output file for this package - only packages with final set to true will be saved to output directory
                this gives you possibility to create a bunch of small, reusable packages which will be included in final packages */
            final: false,
            /* list of files for this package - files paths are relative to directory passed as 'assetsDir', so in this case
               we are using files: assets/file1.js, assets/file2.js */
            files: [
                'file1.js',
                'file2.js'
            ]
        },
        {
            name: 'gallery',
            final: true,
            /** list of required packages - files from packages listed here will be included before files from this package */
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
```

###Preprocessors
Preprocessors are functions that will receive raw content of your files, and will generate from this content final file content (e.g. generate css files from stylus files).
For now jade and stylus are supported.
Definition looks like this:
```javascript
var preprocessors = require('glint').preprocessors;
var stylus = preprocessors.stylus;
var jade = preprocessors.jade;

module.exports = {
    ...
    preprocessors: {
        /** for files with extensions 'styl' use stylus */
        styl: stylus,

        /** for files with extensions 'jade' use jade
            you can also pass object with preprocessor as fn and options for this preprocessor */
        jade: {
            fn: jade,
            options: {
                pretty: true
            }
        }
    },
    ...
};

```
For now you can use only one preprocessor per file extension.

###Postprocessors
Postprocessors are functions that will receive content of your merged packages, and will generate from this content final package content (e.g. uglify/compress merged package)
Definition looks like this:
```javascript
var postprocessors = require('glint').postprocessors;
var cleanCss = postprocessors['clean-css'];
var uglifyJs = postprocessors['uglify-js'];

module.exports = {
    ...
    postprocessors: {
        /** for css files use clean-css */
        css: [cleanCss],
        /** for js files use uglify-js - you can also pass options here */
        js: [{
            fn: uglifyJs,
            options: {
                unsafe: true
            }
        }]
    },
    ...
};


```

###Run Glint
```javascript
./node_modules/.bin/glint --config path/to/config/file.js
```
This will create your packages, preprocess and postprocess them, save them to output directories and create manifest.json file.
Now you have your packages ready to use. You just have to use them in your application

###Using packages with express.js
```javascript
// file clientlibs/config.js
module.exports = {
    assetsDir: 'assets',
    outputDir: 'output',
    manifest: 'output/manifest.json',
    packages: [
        {
            name: 'gallery',
            final: true,
            files: [
                'gallery.css',
                'jquery.js',
                'gallery.js'
            ]
        }
    ]
};

```

```javascript
// file server.js

var express = require('express');

// import glint adapter for express
var glintForExpress = require('glint').adapters.express;

var app = express();
// add glint to express application
app.use(glintForExpress('output/mainfest.json'));

app.get('/', function (req, res) {
    // now you have assets variable in res.locals
    // you can access final packages via package_name.files_category
    var body = '<html><head>' + res.locals.assets.gallery.css + '</head><body>' + res.locals.assets.gallery.js + '</body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

app.listen(3000);
console.log('Listening on port 3000');
```

TBC...
