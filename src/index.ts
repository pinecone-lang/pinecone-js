import parseFile from "./parser";

export function parse(filePath: string) {
    const result = parseFile(filePath);

    if (!result)
        throw new Error(`File not found: ${filePath}`);

    return result;
}