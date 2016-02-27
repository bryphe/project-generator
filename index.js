#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var prompt = require("prompt");
var argv = require("minimist")(process.argv.slice(2));
console.dir(argv);

var templateDirectory = path.join(__dirname, "templates");
var workingDirectory = process.cwd();

if(argv.init) {
    var template = argv.init;
    console.log("Template: " + template);

    var templatePath = path.join(templateDirectory, template);

    if(!fs.existsSync(templatePath)) {
        onError("Invalid template");
    }

    var properties = [
    {
        name: "name"
    }
    ];

    prompt.message = "project-generator";
    prompt.start();

    prompt.get(properties, function (err, result) {
        if(err) {
            onError(err);
        }


        var projectPath = path.join(workingDirectory, result.name);

        copyTemplate(templatePath, projectPath);

    });
}

function copyTemplate(templatePath, destinationPath) {
    fs.copySync(templatePath, destinationPath);
}

function onError(errorMessage) {
    console.error("ERROR: " + errorMessage);
    process.exit(1);
}
