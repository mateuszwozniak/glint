'use strict';

var path = require('path');
var cwd = process.cwd();

module.exports = [
    {
        "name": "core",
        "final": false,
        "files": [
            path.join(cwd, "test/fixtures/assets/file1.js"),
            path.join(cwd, "test/fixtures/assets/file2.js")
        ]
    },
    {
        "name": "gallery",
        "final": true,
        "require": [
            "templates"
        ],
        "files": [
            path.join(cwd, "test/fixtures/assets/gallery.js"),
            path.join(cwd, "test/fixtures/assets/gallery.css")
        ]
    },
    {
        "name": "templates",
        "final": false,
        "files": [
            path.join(cwd, "test/fixtures/assets/template.jade"),
            path.join(cwd, "test/fixtures/assets/styles.styl")
        ]
    }
];
