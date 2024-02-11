import { DocumentWithLoc } from "../types.js"
import { willFillChunkSize, addToBuilder, getLengthNoWhitespace } from "../utils.js"
import { RecursiveParams } from "./textSplitterRecursive.js"

let debug = true
export let setDebug = (d: boolean) =>  debug = d

export let splitOnSeparator = (
  text: string,
  separator: RegExp,
  separators: RegExp[],
  builder: DocumentWithLoc[],
  params: RecursiveParams
): DocumentWithLoc[] => {
  let lineCounter = 1
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
      if (i === 0) {
        // continue splitting the first chunk
        splitOnSeparator(
          chunk,
          separators[currentSeparatorIndex + 1],
          separators,
          builder,
          params
        )
      } else {
        // 0+ chunk splitting start with the clean separator array
        splitOnSeparator(chunk, separators[0], separators, builder, params)
      }
    } else {
      if (debug) console.log(`separator: ${separator}`)
      // add the doc if fits to chunk size
      lineCounter = addToBuilder(builder, chunk, debug, lineCounter)
    }
  }

  return builder
}

// if split chunk is smaller than chunk size, merge it with the next one
const splitAndMergeSmallChunks = (
  text: string,
  separator: RegExp,
  params: RecursiveParams
) => {
  let { chunkSize, chunkOverlap } = params
  let split = text.split(separator)
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