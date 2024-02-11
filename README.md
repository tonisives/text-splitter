# text-splitter

This is a recursive text splitter. It accepts array of separators and a chunk size. It fills the
chunk with text and then splits it by the separator.

It uses types from @langchain, but keeps the module independent and small. This way, you don't have to
include the whole @langchain module.

It also tries to use more functional style of programming, so it should be easier to understand and maintain.

## Installation

`yarn add 'text-splitter@tonisives/text-splitter'``

## sample code

```typescript
const params: RecursiveParamsWithType = {
  chunkSize: 550,
  chunkOverlap: 0,
  type: "md",
}

let text = fs.readFileSync("./src/test/samples/sample.md").toString()
const docs = recursive.splitText(text, params)
printResultToFile("sample.md", docs)

for (let i = 1; i < docs.length; i++) {
  let prev = docs[i - 1]
  let curr = docs[i]

  expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
    curr.metadata.loc.lines.from
  )
}

expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
```
