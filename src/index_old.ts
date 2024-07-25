import jetpack from "fs-jetpack";

function parse(filePath: string) {
    const contents = jetpack.read(filePath);

    if (!contents)
        throw new Error("File does not exist.");

    const lines = contents.split("\n");

    let formatted = "";

    lines.forEach(line => {
        let inString = false;
        let isComment = false;

        let newLine = "";

        line = line.replaceAll("\r", "");

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char == "/" && line[i + 1] == "/")
                isComment = true;

            if (isComment)
                continue;

            if (char == "\"" || char == "\'")
                inString = !inString;

            if (!inString && char == " ")
                continue;

            newLine += char;
        }

        if (newLine.length > 0)
            formatted += newLine + "\n";
    });

    const formattedLines = formatted.split("\n");

    const output: any = {};

    formattedLines.forEach(line => {
        const parts = line.split("=");

        if (parts.length < 2)
            return;

        let key = parts[0];
        const value = parts[1];
        let valueParsed = undefined;

        const keyParts = key.split(":");
        key = keyParts[0];
        const type = keyParts[1];

        switch (type) {
            case "string":
                if (!Number.isNaN(Number(value)))
                    throw new Error("Definition for \"" + key + "\" does not match it's type (" + type + ")");

                valueParsed = value.substring(0, value.length - 1).substring(1);
                
                break;
            case "float":
                valueParsed = parseFloat(value);

                if (Number.isNaN(valueParsed))
                    throw new Error("Definition for \"" + key + "\" does not match it's type (" + type + ")");

                break;
            case "int":
                valueParsed = parseInt(value);

                if (Number.isNaN(valueParsed))
                    throw new Error("Definition for \"" + key + "\" does not match it's type (" + type + ")");

                break;
            default:
                throw new Error("Unkown type: " + type);
        }

        output[key] = valueParsed;
    });

    return output;
}

export { parse };