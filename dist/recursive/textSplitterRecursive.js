import { mdSeparators } from "../separators.js";
import { getLineCounter } from "../utils.js";
import { splitOnSeparator, setDebug } from "./lib.js";
import { splitSol } from "./sol.js";
export let splitText = (text, params) => {
    setDebug(params.debug || false);
    let libParams = {
        ...params,
        chunkOverlap: params.chunkOverlap || 0,
    };
    if (params.type === "sol") {
        return splitSol(text, libParams);
    }
    else {
        let separators;
        if (params.separators) {
            separators = params.separators;
        }
        else if (params.type === "md") {
            separators = mdSeparators;
        }
        else {
            throw new Error("separators must be defined for md type");
        }
        let docs = splitOnSeparator(text, separators[0], separators, [], getLineCounter(), libParams);
        // let withOverlap = this.addOverlapFromPreviousChunks(docs);
        return docs;
    }
};
//# sourceMappingURL=textSplitterRecursive.js.map