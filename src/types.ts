export type TextSplitterParams = {
  chunkSize: number
  keepSeparator: boolean
  chunkOverlap?: number
  lengthFunction?:
    | ((text: string) => number)
    | ((text: string) => Promise<number>)
  trimPageContent?: boolean // whether to trim the final pageContent of the document
}

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