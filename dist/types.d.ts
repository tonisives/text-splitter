export type TextSplitterParams = {
    chunkSize: number;
    keepSeparator: boolean;
    chunkOverlap?: number;
    lengthFunction?: ((text: string) => number) | ((text: string) => Promise<number>);
    trimPageContent?: boolean;
};
export type FileType = "sol" | "md";
type AllParamOptions = Pick<TextSplitterParams, "chunkSize" | "chunkOverlap"> & {
    type?: FileType;
    countWhiteSpace?: boolean;
    separators?: RegExp[];
    debug?: boolean;
};
export type RecursiveParamsWithSeparators = Omit<AllParamOptions, "type" | "separators"> & {
    separators: RegExp[];
};
export type RecursiveParamsWithType = Omit<AllParamOptions, "type" | "separators"> & {
    type: FileType;
};
export type RecursiveParams = RecursiveParamsWithSeparators | RecursiveParamsWithType;
export type Document = {
    pageContent: string;
    metadata: Metadata;
};
export type Metadata = Record<string, any> & {};
export type DocumentWithLoc = Document & {
    metadata: MetadataWithLoc;
};
export type MetadataWithLoc = Metadata & {
    loc: {
        lines: {
            from: number;
            to: number;
        };
    };
};
export {};
