import * as reader from "../reader";

export default function parseFile(filePath: string): any {
    const lines = reader.readLines(filePath);

    if (!lines)
        return;

    const object: any = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.length < 1)
            continue;
        
        let iterationState: "key" | "type" | "value" = "key";

        let isString = false;
        let isComment = false;
        let key: string = "";
        let type: string = "";
        let value: string | number = "";

        for (let i2 = 0; i2 < line.length; i2++) {
            const char = line[i2];

            if (char == "/" && line[i2 + 1] == "/") {
                isComment = true;
                break;
            }

            if (char == "\"" || char == "\'")
                isString = !isString;

            if (char == " " && !isString)
                continue;

            if (char == ":") {
                iterationState = "type";
                continue;
            }

            if (char == "=") {
                iterationState = "value";
                continue;
            }

            switch (iterationState) {
                case "key":
                    key += char;
                    break;
                case "type":
                    type += char;
                    break;
                case "value":
                    value += char;
                    break;
            }
        }

        if (isComment && type.length < 1)
            continue;

        switch (type) {
            case "string":
                const startsWith = value.charAt(0);
                const endsWith = value.charAt(value.length - 1);
                
                if ((startsWith != "\"" && startsWith != "\'") || endsWith !== startsWith)
                    throw new Error(`Value at key "${key}" on line ${i + 1} does not match it's type (${type})`);

                value = value.substring(0, value.length - 1).substring(1);
                break;
            case "int":
                value = parseInt(value);

                if (Number.isNaN(value))
                    throw new Error(`Value at key "${key}" on line ${i + 1} does not match it's type (${type})`);

                break;
            case "float":
                value = parseFloat(value);

                if (Number.isNaN(value))
                    throw new Error(`Value at key "${key}" on line ${i + 1} does not match it's type (${type})`);

                break;
            default:
                throw new Error(`Unknown type "${type}" on line ${i + 1}`);
        }

        object[key] = value;
    }

    return object;
}