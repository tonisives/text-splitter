import { DocumentWithLoc, TextSplitterParams } from "../types.js";
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
export declare let splitText: (text: string, params: RecursiveParams) => DocumentWithLoc[];
export {};
