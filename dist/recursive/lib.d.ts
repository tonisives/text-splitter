import { DocumentWithLoc } from "../types.js";
import { RecursiveParams } from "../types.js";
export declare let setDebug: (d: boolean) => boolean;
export type LibRecursiveParams = Omit<RecursiveParams, "chunkOverlap"> & {
    chunkOverlap: number;
};
export type LineCounter = {
    get: () => number;
    set: (c: number) => void;
};
/**
 * It splits the text with [separator], and then continues splitting it until it fills the chunk size.
 *
 * It then recursively splits all of the chunks.
 *
 * note: since splitting like this can result in small chunks in the end, then addBuilder will merge the last chunk with the previous one if it fits the chunk size.
 */
export declare let splitOnSeparator: (text: string, separator: RegExp, separators: RegExp[], builder: DocumentWithLoc[], lineCounter: LineCounter, params: LibRecursiveParams) => DocumentWithLoc[];
