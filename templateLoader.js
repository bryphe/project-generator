var fs = require("fs");
var path = require("path");

var TemplateLoader = function() {

    this.getTemplates = function() {
        var currentPath = path.join(__dirname, "templates");
        var subDirectories = getDirectories(currentPath);
        return subDirectories;
    };

    function getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
};



module.exports = new TemplateLoader();
