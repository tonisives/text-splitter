import { Document, DocumentWithLoc } from "./types.js"
import chalk from "chalk";

export const getLengthNoWhitespace = (lines: string[]) => {
  return lines.reduce((acc, curr) => acc + curr.trim().length, 0) + lines.length - 1;
}

// @ts-ignore
export const debugFillChunks = (addedLines: string[], currLines: string[], chunkSize: number) => {
  // debug
  let fullDoc = [...addedLines, ...currLines].join("\n")
  let fullDocLength = getLengthNoWhitespace([...addedLines, ...currLines])
  console.log(`newLength full ${fullDoc.length} no whitespace ${fullDocLength}`);
}

export const debugDocBuilder = (docs: Document[]) => {
  let fullDoc = docs.map(d => d.pageContent).join("\n")
  console.log(`current doc builder\n${chalk.yellow(fullDoc)}`)
}

export const addToBuilder = (
  builder: DocumentWithLoc[],
  pageContent: string,
  log: boolean,
  lineCounter: number
): number => {
  if (log) console.log(`adding to builder:\n${chalk.blue(pageContent)}`);

  let lineCount = pageContent.split("\n").length - 1

  builder.push({
    pageContent: pageContent,
    metadata: {
      source: "",
      loc: {
        lines: {
          from: lineCounter,
          to: lineCounter + lineCount,
        },
      },
    },
  });

  lineCounter += lineCount;

  // if (log) debugDocBuilder(builder);

  return lineCounter
};

export const willFillChunkSize = (chunk: string, builder: any[], chunkSize: number, chunkOverlap: number) => {
  let overLapReduce = (builder.length > 0 ? chunkOverlap : 0);

  let chunkWillFillChunkSize = getLengthNoWhitespace(chunk.split("\n")) >
    (chunkSize - overLapReduce);
  return chunkWillFillChunkSize;
}
