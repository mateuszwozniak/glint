module.exports = {
    dev: {
        gallery: {
            css: [
                "sources/css/styles.styl.css",
                "sources/css/gallery.css"
            ],
            js: [
                "sources/js/template.jade.js",
                "sources/js/gallery.js"
            ]
        }
    },
    prod: {
        gallery: {
            css: /build\/css\/gallery\.([0-9a-f]{32})\.css/,
            js: /build\/js\/gallery\.([0-9a-f]{32})\.js/
        }
    }
}
