var path = require('path');
var cwd = process.cwd();

module.exports =  [
    {
        "name": "gallery",
        "files": [
            path.join(cwd, "test/fixtures/assets/template.jade"),
            path.join(cwd, "test/fixtures/assets/styles.styl"),
            path.join(cwd, "test/fixtures/assets/gallery.js"),
            path.join(cwd, "test/fixtures/assets/gallery.css")
        ]
    }
];