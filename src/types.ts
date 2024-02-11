// splitter

export type TextSplitterParams = {
  chunkSize: number
  keepSeparator: boolean
  chunkOverlap?: number
  lengthFunction?:
    | ((text: string) => number)
    | ((text: string) => Promise<number>)
  trimPageContent?: boolean // whether to trim the final pageContent of the document
}

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


// langchain


export type Document = {
  pageContent: string
  metadata: Metadata
}

export type Metadata = Record<string, any> & {
}

export type DocumentWithLoc = Document & {
  metadata: MetadataWithLoc
}

export type MetadataWithLoc = Metadata & {
  loc: {
    lines: {
      from: number
      to: number
    }
  }
}