import { Document } from "./types.js"
import chalk from "chalk"

export const getLengthNoWhitespace = (lines: string[]) => {
  return (
    lines.reduce((acc, curr) => acc + curr.trim().length, 0) + lines.length - 1
  )
}

export let getLineCounter = () => {
  let count = 1
  let lineCounter = {
    get: () => count,
    set: (c: number) => (count = c),
  }
  return lineCounter
}

// @ts-ignore
export const debugFillChunks = (
  addedLines: string[],
  currLines: string[],
  chunkSize: number
) => {
  // debug
  let fullDoc = [...addedLines, ...currLines].join("\n")
  let fullDocLength = getLengthNoWhitespace([...addedLines, ...currLines])
  console.log(`newLength full ${fullDoc.length} no whitespace ${fullDocLength}`)
}

export const debugDocBuilder = (docs: Document[]) => {
  let fullDoc = docs.map((d) => d.pageContent).join("\n")
  console.log(`current doc builder\n${chalk.yellow(fullDoc)}`)
}

export const willFillChunkSize = (
  chunk: string,
  builder: any[],
  chunkSize: number,
  chunkOverlap: number
) => {
  let overLapReduce = builder.length > 0 ? chunkOverlap : 0

  let chunkWillFillChunkSize =
    getLengthNoWhitespace(chunk.split("\n")) > chunkSize - overLapReduce
  return chunkWillFillChunkSize
}
