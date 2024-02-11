import { mdSeparators } from "../separators.js"
import {
  DocumentWithLoc,
  RecursiveParams,
  RecursiveParamsWithSeparators,
  RecursiveParamsWithType,
} from "../types.js"
import { getLineCounter } from "../utils.js"
import { splitOnSeparator, setDebug, LibRecursiveParams } from "./lib.js"
import { splitSol } from "./sol.js"

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
