import fs from "fs";

function parseValue(isArray: boolean, type: string, value: string): { value?: string | number | boolean | any[], typeError: boolean } {
    let parsedValue: string | number | boolean | any[];

    if (isArray) {
        const startsWith = value[0];
        const endsWith = value[value.length - 1];
        
        if (startsWith != "[" || endsWith != "]")
            return { typeError: true };

        parsedValue = [];

        const elements = value.substring(0, value.length - 1).substring(1).split(",");

        for (let i = 0; i < elements.length; i++) {
            const result = parseValue(false, type, elements[i]);

            if (result.typeError)
                return { typeError: true };

            parsedValue.push(result.value);
        }
    }
    else {
        switch (type) {
            case "string":
                const startsWith = value[0];
                const endsWith = value[value.length - 1];
                
                if ((startsWith != "\"" && startsWith != "\'") || endsWith !== startsWith)
                    return { typeError: true };
    
                parsedValue = value.substring(0, value.length - 1).substring(1);
                break;
            case "int":
                parsedValue = parseInt(value);
    
                if (Number.isNaN(parsedValue))
                    return { typeError: true };
    
                break;
            case "float":
                parsedValue = parseFloat(value);
    
                if (Number.isNaN(parsedValue))
                    return { typeError: true };
    
                break;
            case "boolean":
                if (value === "true" || value == "1")
                    parsedValue = true;
                else if (value === "false" || value == "0")
                    parsedValue = false;
                else
                    return { typeError: true };

                break;
            default:
                return { typeError: true };
        }
    }

    return { value: parsedValue, typeError: false };
}

function parse(x: string, options: { readFile: boolean } = { readFile: true }): object {
    let content: string = x;

    if (options.readFile) {
        const result = fs.readFileSync(x, "utf-8");

        if (!result)
            throw new Error(`File not found: ${x}`);

        content = result;
    }

    const lines: string[] = [];
    content.split("\n").forEach(line => lines.push(line.replaceAll("\r", ""))); // Remove line-breaks

    const parsed: any = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.length < 1)
            continue;

        let iterationState: "key" | "type" | "value" = "key";

        let isString = false;
        let isComment = false;
        let isArray = false;
        let key = "";
        let type = "";
        let value = "";

        for (let i2 = 0; i2 < line.length; i2++) {
            const char = line[i2];
            const nextChar = line[i2 + 1];

            if (char == "/" && nextChar == "/" && !isString) {
                isComment = true;
                break;
            }

            if (char == "\"" || char == "\'")
                isString = !isString;

            if (char == " " && !isString)
                continue;

            if (char == ":" && !isString) {
                iterationState = "type";
                continue;
            }

            if (char == "=" && !isString) {
                iterationState = "value";
                continue;
            }

            switch (iterationState) {
                case "key":
                    key += char;
                    break;
                case "type":
                    if (char == "[" && nextChar == "]") {
                        isArray = true;
                        i2 += 1; // skip over next iteration
                        break;
                    }

                    type += char;
                    break;
                case "value":
                    value += char;
                    break;
            }
        }

        if (isComment && type.length < 1)
            continue;

        if (type !== "string" && type !== "boolean" && type !== "int" && type !== "float")
            throw new Error(`Unknown type "${type}" on line ${i + 1}`);

        const parseResult = parseValue(isArray, type, value);

        if (parseResult.typeError)
            throw new Error(`Value at key "${key}" on line ${i + 1} does not match it's type (${type})`);

        parsed[key] = parseResult.value;
    }

    return parsed;
}

export { parse };