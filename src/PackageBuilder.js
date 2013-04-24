'use strict';

module.exports = PackageBuilder;

function PackageBuilder(packages) {
    packages = packages.slice();

    var packagesByName = {};
    var packagesTree = {};
    var flatPackages = {};
    var finalPackages = [];

    this.getPackages = function () {
        return finalPackages;
    };

    this.build = function () {
        indexPackagesByName();
        buildPackagesTree();
        flattenPackages();
        buildFinalPackages();
    };

    function indexPackagesByName() {
        for (var i = 0, len = packages.length; i < len; i++) {
            packagesByName[packages[i].name] = packages[i];
        }
    }

    function buildPackagesTree() {
        for (var i = 0, len = packages.length; i < len; i++) {
            buildPackageRequirements(packages[i].name);
        }
    }

    function buildPackageRequirements(pkgName) {
        if (packagesTree.hasOwnProperty(pkgName)) {
            return packagesTree[pkgName];
        }

        var pkg = packagesByName[pkgName];
        if (pkg.require) {
            var requirements = [];
            for (var i = 0, len = pkg.require.length; i < len; i++) {
                requirements.push(buildPackageRequirements(pkg.require[i]));
            }
            // replace requirement names with build tree
            pkg.require = requirements;
        }
        packagesTree[pkgName] = pkg;
        return pkg;
    }

    function flattenPackages() {
        for (var i = 0, len = packages.length; i < len; i++) {
            squashPackage(packagesTree[packages[i].name]);
        }
    }

    function squashPackage(pkg) {
        var files = [];
        getRequirementsFiles(pkg)
        flatPackages[pkg.name] = files;

        // deep first search based squashing
        function getRequirementsFiles(requirement) {
            if (requirement.require) {
                for (var i = 0, len = requirement.require.length; i < len; i++) {
                    getRequirementsFiles(requirement.require[i]);
                }
            }
            files = files.concat(requirement.files);
        }
    }

    function buildFinalPackages() {
        packages.forEach(function buildIfFinal(pkg) {
            if (pkg.final) {
                finalPackages.push({
                    name: pkg.name,
                    files: flatPackages[pkg.name]
                });
            }
        });
    }

}