#!/usr/bin/env node

import * as process from "process";
import * as program from "commander";

program
    .version('1.0.0')
    .command('process [database.definitions.json] [database.specs.json] [database.rules.json]',
            'Process a rules definitions file and a specs file into an output file. Leave empty for defaults.')
    .parse(process.argv);