#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const dist_1 = require("ts-node/dist");
const yargs_1 = require("yargs");
const TS_NODE_OPTIONS = [
    "fast",
    "lazy",
    "cache",
    "cacheDirectory",
    "compiler",
    "project",
    "ignore",
    "ignoreWarnings",
    "disableWarnings",
    "getFile",
    "fileExists",
    "compilerOptions",
];
const tsNodeOptions = Object.assign({}, ...TS_NODE_OPTIONS.map((option) => {
    if (yargs_1.argv[option]) {
        return (option === "compilerOptions")
            ? { compilerOptions: dist_1.parse(yargs_1.argv[option]) }
            : { [option]: yargs_1.argv[option] };
    }
}));
dist_1.register(tsNodeOptions);
const Jasmine = require("jasmine");
const Command = require("jasmine/lib/command");
const jasmine = new Jasmine({ projectBaseDir: path.resolve() });
const examplesDir = path.join("node_modules", "jasmine-core", "lib", "jasmine-core", "example", "node_example");
const command = new Command(path.resolve(), examplesDir, console.log);
const configPath = yargs_1.argv.config || process.env.JASMINE_CONFIG_PATH || "spec/support/jasmine.json";
const initReporters = (config) => {
    if (config.reporters && config.reporters.length > 0) {
        jasmine.env.clearReporters();
        config.reporters.forEach((reporter) => {
            const parts = reporter.name.split("#");
            const name = parts[0];
            const member = parts[1];
            const reporterClass = member ? require(name)[member] : require(name);
            jasmine.addReporter(new (reporterClass)(reporter.options));
        });
    }
};
let configJSON = "";
try {
    configJSON = fs.readFileSync(path.resolve(configPath), "utf8");
}
catch (e) { }
if (configJSON) {
    const config = JSON.parse(configJSON);
    initReporters(config);
}
const commandOptions = process.argv.slice(2);
command.run(jasmine, commandOptions);
//# sourceMappingURL=index.js.map