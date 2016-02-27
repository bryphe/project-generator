#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var prompt = require("prompt");
var argv = require("minimist")(process.argv.slice(2));
console.dir(argv);

var templateJsonFileName = "template.json";

var templateDirectory = path.join(__dirname, "templates");
var workingDirectory = process.cwd();

if(argv.init) {
    var template = argv.init;
    console.log("Template: " + template);

    var templatePath = path.join(templateDirectory, template);

    if(!fs.existsSync(templatePath)) {
        onError("Invalid template");
    }

    var templateJsonPath = path.join(templatePath, templateJsonFileName);

    if(!fs.existsSync(templateJsonPath)) {
        onError("Could not find template.json in: " + templatePath);
    }

    var templateJson = JSON.parse(fs.readFileSync(templateJsonPath, "utf8"));
    console.log(templateJson);

    templateJson.packageFolder = templateJson.packageFolder || "package";
    var templatePackagePath = path.join(templatePath, templateJson.packageFolder);

    // TODO: Read in properties from template json
    // TODO: Allow for plugins to add / remove properties
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

        // TODO: Run plugins to inject properties
        var projectPath = path.join(workingDirectory, result.name);

        // TODO: Inject properties

        copyTemplate(templatePackagePath, projectPath);

    });
}

function copyTemplate(templatePath, destinationPath) {
    fs.copySync(templatePath, destinationPath);
}

function onError(errorMessage) {
    console.error("ERROR: " + errorMessage);
    process.exit(1);
}
