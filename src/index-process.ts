#!/usr/bin/env node

import * as process from "process";
import * as program from "commander";
import {Specs} from "./specs/specs";
import {Rules} from "./rules/rules";

program.parse(process.argv);

let rulesFile = `database.definitions.json`;
if (program.args.length > 0) {
    rulesFile = `${program.args[0]}`;
}

let specsFile = `database.specs.json`;
if (program.args.length > 1) {
    specsFile = `${program.args[1]}`;
}

let outFile = `database.rules.json`;
if (program.args.length > 2) {
    outFile = `${program.args[2]}`;
}

const specs = new Specs(specsFile);
const rules = new Rules(rulesFile);

rules.replaceDefinitionsWithSpecs(specs);
rules.writeToFile(outFile);