#Glint
Glint is an asset (css, js, whatever-you-need) management tool for your project.
It helps you better organize files you serve to browser, as well as process them with any processor you need, even with your own one.

For now it works with express.js but you can simply adjust it to your project and technology.

####! This documentation is not complete so if you need any help don't hesitate to contact me (mail is inside package.json) !

Checkout examples [here](https://github.com/mateuszwozniak/glint-examples/)


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
#####For now jade, stylus and scss are supported.
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


##Glint options
You can pass following options to glint
- `-c, --config path/to/config/file.js` - specify configuration file
- `-w, --watch` - watch for changes in files and rebuild suitable packages immediately after change
- `-d, --dev` - use development mode - don't merge files, only preprocess them and copy to output/sources location.


##What exactly glint does
When you run glint a several things happen:

1. glint collects files for packages, and builds files lists for final packages
2. for all files glint runs preprocessors to create desired file content
3. for all final packages glint merges files
4. for all final packages glint runs postprocessors
5. all files from final packages are written to following directories

```javascript
--output // <- directory you passed as outputDir in configuration file
 |
 |--build // directory that holds build (preprocessed, merged and postprocessed files)
 | |--css // css files and files that were preprocessed to css files (e.g. stylus files)
 | |--js  // js files and files that were preprocessed to js files (e.g. jade)
 |
 |--sources // directory that holds preprocessed files (not merged, for development usage)
 | |--css // css files and files that were preprocessed to css files (e.g. stylus files)
 | |--js  // js files and files that were preprocessed to js files (e.g. jade)

```

####! This documentation is not complete so if you need any help don't hesitate to contact me (mail is inside package.json) !

TBC...
