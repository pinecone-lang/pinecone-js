import jetpack from "fs-jetpack";

function readLines(filePath: string): string[] | undefined {
    const contents = jetpack.read(filePath);

    if (!contents)
        return;

    const lines: string[] = [];

    contents.split("\n").forEach(line => lines.push(line.replaceAll("\r", "")));

    return lines;
}

export { readLines };