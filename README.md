# pinecone-lang
Pinecone (.pc) is a fast open-sourced configuration language
## Installation
```
npm i @pinecone-lang/pinecone-js
```
## Marksheet
Line structure: `key`: `type` = `value`<br>
Supported types: `string`, `int`, `float`<br>
Whitespace is ignored outside of brackets (`"` or `'`)<br>
You can comment using `//`
## Configuration example
```
// this is a comment and will be ignored

title: string = "Some Title" // you can also place comments here
version: string = "1.0.0"
someInt: int = 0
someFloat: float = 0.15
```
## Usage example
```js
import pinecone from "@pinecone-lang/pinecone-js";
const pinecone = require("@pinecone-lang/pinecone-js");

try
{
    console.log(pinecone.parse("example.pc"));
}
catch (err)
{
    console.error("Failed to parse pinecone file:", err);
}
```