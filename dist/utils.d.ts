import { Document } from "./types.js";
export declare const getLengthNoWhitespace: (lines: string[]) => number;
export declare let getLineCounter: () => {
    get: () => number;
    set: (c: number) => number;
};
export declare const debugFillChunks: (addedLines: string[], currLines: string[], chunkSize: number) => void;
export declare const debugDocBuilder: (docs: Document[]) => void;
export declare const willFillChunkSize: (chunk: string, builder: any[], chunkSize: number, chunkOverlap: number) => boolean;
