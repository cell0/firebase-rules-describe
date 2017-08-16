import {LoadJson} from "../load-json/load-json";
import {Specs} from "../specs/specs";

export class Rules {
    private filename: string;
    private json: any;
    private specs: Specs;

    constructor(filename: string) {
        this.json = LoadJson.loadFromFile(filename);
        if (!this.json) {
            console.error(`Error: Could not load definitions file (${filename}).`);
            process.exit(1);
        }
        this.filename = filename;
    }

    replaceDefinitionsWithSpecs(specs: Specs) {
        this.specs = specs;
        this.json = this.replaceTree(this.json);
    }

    writeToFile(filename: string) {
        LoadJson.writeJsonToFile(this.json, filename);
    }

    private replaceTree(json: any) {
        Object.keys(json).forEach((key) => {

            if (typeof json[key] === 'string') {
                json[key] = this.replaceDefinitionWithSpecs(json[key]);
            }
            else if (typeof json[key] === 'object') {
                json[key] = this.replaceTree(json[key]);
            }
        });
        return json;
    }

    private replaceDefinitionWithSpecs(definition: string) {

        let matches = definition.match(/\{[^}]+}/ig);

        if (!matches) {
            return definition;
        }

        matches.forEach((match: string) => {
            const specId = match.substring(1, match.length - 1);
            const spec = this.specs.getSpec(specId);

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