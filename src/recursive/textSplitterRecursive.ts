import { mdSeparators } from "../separators.js"
import { DocumentWithLoc, TextSplitterParams } from "../types.js"
import { getLineCounter } from "../utils.js"
import { splitOnSeparator, setDebug, LibRecursiveParams } from "./lib.js"
import { splitSol } from "./sol.js"

export type FileType = "sol" | "md"

type AllParamOptions = Pick<
  TextSplitterParams,
  "chunkSize" | "chunkOverlap"
> & {
  type?: FileType
  // by default, we don't count whitespace in the start/end of lines towards the chunk size
  // (eg. source code indention)
  countWhiteSpace?: boolean
  separators?: RegExp[]
  debug?: boolean
}

// input with custom separators
export type RecursiveParamsWithSeparators = Omit<
  AllParamOptions,
  "type" | "separators"
> & { separators: RegExp[] }

// input with type. if type is defined, then don't need to set separators array
export type RecursiveParamsWithType = Omit<
  AllParamOptions,
  "type" | "separators"
> & {
  type: FileType
}
export type RecursiveParams =
  | RecursiveParamsWithSeparators
  | RecursiveParamsWithType

export let splitText = (
  text: string,
  params: RecursiveParams
): DocumentWithLoc[] => {
  setDebug(params.debug || false)
  let libParams: LibRecursiveParams = {
    ...params,
    chunkOverlap: params.chunkOverlap || 0,
  }

  if ((params as RecursiveParamsWithType).type === "sol") {
    return splitSol(text, libParams)
  } else {
    let separators

    if ((params as RecursiveParamsWithSeparators).separators) {
      separators = (params as RecursiveParamsWithSeparators).separators
    } else if ((params as RecursiveParamsWithType).type === "md") {
      separators = mdSeparators
    } else {
      throw new Error("separators must be defined for md type")
    }

    let docs = splitOnSeparator(
      text,
      separators[0],
      separators,
      [],
      getLineCounter(),
      libParams
    )
    // let withOverlap = this.addOverlapFromPreviousChunks(docs);
    return docs
  }
}
