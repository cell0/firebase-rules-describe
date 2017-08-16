import * as fs from "fs";
const stripJsonComments = require("strip-json-comments");

export class LoadJson {

    static loadFromFile(file: string) {
        let json = this.loadFileWithoutComments(file);
        if (json) {
            json = this.loadDependencies(json);
        }
        return json
    }

    private static loadFileWithoutComments(file: string) {
        if (!fs.existsSync(file)) {
            return false;
        }

        let data = fs.readFileSync(file);

        try {
            return JSON.parse(stripJsonComments(data.toString()));
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    private static loadDependencies(json: any) {
        Object.keys(json).forEach((key) => {

            if (typeof json[key] === 'string') {
                const matches = json[key].match(/\[([^\]]+\.json)]/i);

                if (matches != null && matches.length > 1) {
                    const file = matches[1];

                    const subJson = this.loadFileWithoutComments(file);
                    if (subJson) {
                        if (subJson[key]) {
                            json[key] = subJson[key];
                        }
                        else {
                            json[key] = subJson;
                        }
                    }
                    else {
                        console.error(`Error: Cannot load file ${file}!`);
                        process.exit(3);
                    }
                }
            }

            if (typeof json[key] === 'object') {
                json[key] = this.loadDependencies(json[key]);
            }

        });

        return json;
    }

    static writeJsonToFile(json: any, file: string) {
        fs.writeFile(file, JSON.stringify(json, null, 2), (error) => {
            if (error) {
                console.error(`Error on writing to ${file}.`, error);
                process.exit(4);
            }

            console.log(`${file} saved!`);
        });
    }
}