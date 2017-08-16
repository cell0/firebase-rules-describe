import {LoadJson} from "../load-json/load-json";

export class Specs {
    private filename: string;
    private json: any;
    private specs: any = {};

    constructor(filename: string) {
        this.json = LoadJson.loadFromFile(filename);
        this.filename = filename;

        if (!this.json) {
            console.error(`Error: Could not load specs file (${filename}).`);
            process.exit(1);
        }
        else {
            this.replaceSubDefinitions(this.json);
        }
    }

    getSpec(specId: string) {
        return this.specs[specId.trim()];
    }

    private replaceSubDefinitions(json: any) {
        Object.keys(json).forEach(key => {
            if (typeof json[key] === 'string') {
                this.specs[key] = json[key];
            }
        });
        Object.keys(this.specs).forEach(key => {
            this.specs[key] = this.replaceDefinitionWithSpecs(this.specs[key]);
        });
    }

    private replaceDefinitionWithSpecs(definition: string) {

        let matches = definition.match(/\{[^}]+}/ig);

        if (!matches) {
            return definition;
        }

        matches.forEach((match: string) => {
            const specId = match.substring(1, match.length - 1);
            const spec = this.getSpec(specId);

            if (typeof spec === 'string') {
                definition = definition.replace(match, spec);
            }
            else {
                console.error(`Error: No spec found for: {${specId}}`);
                process.exit(2);
            }
        });

        return definition;
    }
}