# text-splitter

This is a recursive text splitter. It accepts array of separators and a chunk size. It fills the
chunk with text and then splits it by the separator.

It uses types from @langchain, but keeps the module independent and small. This way, you don't have to
include the whole @langchain module.

It also tries to use more functional style of programming, so it should be easier to understand and maintain.

## Stack
```
es module
vitest
chalk for logging
```

## Installation

`yarn add 'text-splitter@tonisives/text-splitter'``


## sample code

```typescript
let text = fs.readFileSync("./src/test/samples/sample.md").toString()
const params: RecursiveParamsWithType = {
  chunkSize: 550,
  chunkOverlap: 0,
  type: "md", // or separators: ["\n", "\n\n", "\n\n\n"]
}

const docs:Document[] = recursive.splitText(text, params)
printResultToFile("sample.md", docs)

expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)

```


## Performance

TODO: add comparison between langchain RecursiveTextSplitter. This one could be faster, because it doesn't compare strings for line count. But it's not tested yet.