import { mdSeparators } from "../separators.js"
import { DocumentWithLoc, TextSplitterParams } from "../types.js"
import { splitOnSeparator, setDebug } from "./lib.js"
import { splitSol } from "./sol.js"

export type FileType = "sol" | "md"

type AllParamOptions = Pick<
  TextSplitterParams,
  "chunkSize" | "chunkOverlap"
> & {
  // by default, we don't count whitespace in front of / end of lines towards the chunk size
  type?: FileType // if defined, don't need to set separators for md and sol
  countWhiteSpace?: boolean
  separators?: RegExp[]
  debug?: boolean
}

export type RecursiveParamsWithSeparators = Omit<
  AllParamOptions,
  "type" | "separators"
> & { separators: RegExp[] }

export type RecursiveParamsWithType = Omit<
  AllParamOptions,
  "type" | "separators"
> & {
  type: FileType
}
export type RecursiveParams = RecursiveParamsWithSeparators | RecursiveParamsWithType

export let splitText = (
  text: string,
  params: RecursiveParams
): DocumentWithLoc[] => {
  setDebug(params.debug || false)

  if ((params as RecursiveParamsWithType).type === "sol") {
    return splitSol(text, params)
  } else {
    let separators

    if ((params as RecursiveParamsWithSeparators).separators) {
      separators = (params as RecursiveParamsWithSeparators).separators
    } else if ((params as RecursiveParamsWithType).type === "md") {
      separators = mdSeparators
    } else {
      throw new Error("separators must be defined for md type")
    }

    separators = (params as RecursiveParamsWithSeparators).separators

    let docs = splitOnSeparator(text, separators[0], separators, [], params)
    // let withOverlap = this.addOverlapFromPreviousChunks(docs);
    return docs
  }
}
