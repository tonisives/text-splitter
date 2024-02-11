import { DocumentWithLoc } from "../types.js";
import { LibRecursiveParams } from "./lib.js";
export declare let splitSol: (text: string, params: LibRecursiveParams) => DocumentWithLoc[];
export declare let preSplitSol: (text: string, chunkSize: number, chunkOverlap: number) => string[];
export declare const splitOnSolComments: (text: string) => string[][];
