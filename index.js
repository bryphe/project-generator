#!/usr/bin/env node

var colors = require("colors");
var fs = require("fs-extra");
var path = require("path");
var prompt = require("prompt");
var replace = require("replace");
var templateLoader = require("./templateLoader");
var argv = require("minimist")(process.argv.slice(2));

var templateJsonFileName = "template.json";

var templateDirectory = path.join(__dirname, "templates");
var workingDirectory = process.cwd();

if(argv.ls) {
    var templates = templateLoader.getTemplates();
    console.log(colors.green("Available templates:"));
    templates.forEach(function (template) {
        console.log("--" + template);
    });
} else if(argv.init) {
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

    templateJson.packageFolder = templateJson.packageFolder || "package";
    var templatePackagePath = path.join(templatePath, templateJson.packageFolder);

    // TODO: Read in properties from template json
    // TODO: Allow for plugins to add / remove properties
    var properties = [
    {
        name: "name"
    }
    ];

    var templateProperties = templateJson.properties || [];

    templateProperties.forEach(function (prop) {
        properties.push(prop);
    });

    prompt.message = template;
    prompt.start();

    prompt.get(properties, function (err, result) {
        if(err) {
            onError(err);
        }

        // TODO: Run plugins to inject properties
        console.log(colors.yellow("Copying template..."));
        copyTemplate(templatePackagePath, workingDirectory);

        // Inject properties
        console.log(colors.yellow("Injecting values..."));
        properties.forEach(function (prop) {
            var value = result[prop.name];
            replace({
                regex: "{{" + prop.name + "}}",
                replacement: value,
                paths: [workingDirectory],
                recursive: true,
                silent: true,
            });
        });


        console.log(colors.green("Template creation successful"))
    });
}

function copyTemplate(templatePath, destinationPath) {
    fs.copySync(templatePath, destinationPath);
}

function onError(errorMessage) {
    console.error("ERROR: " + errorMessage);
    process.exit(1);
}
