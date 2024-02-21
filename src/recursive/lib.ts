import chalk from "chalk"
import { DocumentWithLoc } from "../types.js"
import { willFillChunkSize, getLengthNoWhitespace } from "../utils.js"
import { RecursiveParams } from "../types.js"

let debug = true
export let setDebug = (d: boolean) => (debug = d)

export type LibRecursiveParams = Omit<RecursiveParams, "chunkOverlap"> & {
  chunkOverlap: number
}
export type LineCounter = {
  get: () => number
  set: (c: number) => void
}

/**
 * It splits the text with [separator], and then continues splitting it until it fills the chunk size.
 *
 * It then recursively splits all of the chunks.
 *
 * note: since splitting like this can result in small chunks in the end, then addBuilder will merge the last chunk with the previous one if it fits the chunk size.
 */
export let splitOnSeparator = (
  text: string,
  separator: RegExp,
  separators: RegExp[],
  builder: DocumentWithLoc[],
  lineCounter: LineCounter,
  params: LibRecursiveParams
): DocumentWithLoc[] => {
  let { chunkSize, chunkOverlap } = params
  let currentSeparatorIndex = separators.indexOf(separator)
  let separatorChunks: string[] = []

  separatorChunks = splitAndMergeSmallChunks(text, separator, params)

  for (let i = 0; i < separatorChunks.length; i++) {
    let chunk = separatorChunks[i]
    let chunkWillFillChunkSize = willFillChunkSize(
      chunk,
      [],
      chunkSize,
      chunkOverlap
    ) // splitAndMerge uses [] as builder

    if (chunkWillFillChunkSize) {
      if (separator === separators[separators.length - 1]) {
        // this is a long text without spaces. just split it by chunk size
        let chunked = splitByChunkSize(text, chunkSize, chunkOverlap)
        for (let j = 0; j < chunked.length; j++) {
          addToBuilder(builder, chunked[j], debug, lineCounter, params)
        }

        break
      }

      let nextSeparator
      if (i === 0) {
        // continue splitting the first chunk
        nextSeparator = separators[currentSeparatorIndex + 1]
      } else {
        // 0+ chunk splitting start with the clean separator array
        nextSeparator = separators[0]
      }
      splitOnSeparator(
        chunk,
        nextSeparator,
        separators,
        builder,
        lineCounter,
        params
      )
    } else {
      if (debug) console.log(`separator: ${separator}`)
      // add the doc if fits to chunk size
      addToBuilder(builder, chunk, debug, lineCounter, params)
    }
  }

  return builder
}

let splitByChunkSize = (
  text: string,
  chunkSize: number,
  chunkOverlap: number
) => {
  let chunks = [] as string[]
  for (let i = 0; i < text.length; i += chunkSize + chunkOverlap) {
    let chunk = text.slice(
      i - chunkOverlap / 2,
      i + chunkSize + chunkOverlap / 2
    )
    chunks.push(chunk)
  }

  return chunks
}

// if split chunk is smaller than chunk size, merge it with the next one
const splitAndMergeSmallChunks = (
  text: string,
  separator: RegExp,
  params: LibRecursiveParams
) => {
  let { chunkSize, chunkOverlap } = params
  // /(?<=\n)(?=(s+)### )/g retains empty strings
  let split = text.split(separator).filter((it) => it.length > 0)
  let builder = [] as string[]
  let results = [] as string[]

  for (let i = 0; i < split.length; i++) {
    builder.push(split[i])

    if (willFillChunkSize(builder.join(""), [], chunkSize, chunkOverlap)) {
      if (builder.length > 1) {
        results.push(builder.slice(0, -1).join(""))
        builder = [builder[builder.length - 1]]
      } else {
        results.push(builder.join(""))
        builder = []
      }
    }
  }

  if (builder.length > 0) {
    results.push(builder.join(""))
  }

  return results
}

const addToBuilder = (
  builder: DocumentWithLoc[],
  pageContent: string,
  log: boolean,
  lineCounter: LineCounter,
  params: LibRecursiveParams
) => {
  if (log) console.log(`adding to builder:\n${chalk.blue(pageContent)}`)
  let chunkLineCount = pageContent.split("\n").length - 1

  // the [splitOnSeparator] logic breaks text so it fits the chunk size. This means that the last chunk
  // can be smaller than full chunk size. Therefore, we merge with the previous chunk if possible
  if (
    builder.length > 0 &&
    !willFillChunkSize(
      builder[builder.length - 1].pageContent + pageContent,
      builder,
      params.chunkSize,
      params.chunkOverlap
    )
  ) {
    let prev = builder[builder.length - 1]
    builder[builder.length - 1] = {
      pageContent: prev.pageContent + pageContent,
      metadata: {
        ...prev.metadata,
        loc: {
          lines: {
            from: prev.metadata.loc.lines.from,
            to: prev.metadata.loc.lines.to + chunkLineCount,
          },
        },
      },
    }

    lineCounter.set(lineCounter.get() + chunkLineCount)
  } else {
    builder.push({
      pageContent: pageContent,
      metadata: {
        loc: {
          lines: {
            from: lineCounter.get(),
            to: lineCounter.get() + chunkLineCount,
          },
        },
      },
    })

    lineCounter.set(lineCounter.get() + chunkLineCount)
  }
}

let addOverlapFromPreviousChunks = (
  builder: DocumentWithLoc[],
  params: RecursiveParams
) => {
  if (builder.length <= 1) return builder

  for (let i = 1; i < builder.length; i++) {
    let currLines = builder[i].pageContent.split("\n")

    let prevChunkLines = builder[i - 1].pageContent.split("\n")
    let addedLines = getLinesFromPrevChunks(prevChunkLines, currLines, params)

    addedLines = addedLines.reverse()
    let newContent = [...addedLines, ...currLines].join("\n")

    builder[i] = {
      pageContent: newContent,
      metadata: {
        ...builder[i].metadata,
        loc: {
          lines: {
            from: builder[i].metadata.loc.lines.from - addedLines.length,
            to: builder[i].metadata.loc.lines.to,
          },
        },
      },
    }
  }

  return builder
}

let getLinesFromPrevChunks = (
  prevChunkLines: string[],
  currLines: string[],
  params: RecursiveParams
) => {
  let { countWhiteSpace, chunkSize } = params
  let addedLines = [] as string[]

  for (let j = prevChunkLines.length - 1; j >= 0; j--) {
    let prevLine = prevChunkLines[j]
    addedLines.push(prevLine)
    let newLength = getLengthNoWhitespace_(
      [...addedLines, ...currLines],
      countWhiteSpace ?? false
    )

    if (newLength > chunkSize) {
      // only take a slice from the lastly added line
      let lastAddedLine = addedLines[addedLines.length - 1]
      if (!countWhiteSpace) lastAddedLine = lastAddedLine.trim()
      let overflow = newLength - chunkSize
      let sliceAmount = lastAddedLine.length - overflow

      if (sliceAmount <= 0) {
        // whole new line is overflown
        addedLines = addedLines.slice(0, -1)
        // debug(addedLines, currLines, this.chunkSize)
        break
      }

      let slice = lastAddedLine.slice(-sliceAmount)
      addedLines[addedLines.length - 1] = slice
      // debug(addedLines, currLines, this.chunkSize)
      break
    }
  }

  return addedLines
}

let getLengthNoWhitespace_ = (lines: string[], countWhiteSpace: boolean) => {
  if (countWhiteSpace) return lines.join("\n").length
  return getLengthNoWhitespace(lines)
}
