import { FindingEmbMeta } from "./types-finding.js";
export declare const ALL_PLATFORMS: string[];
export type PlatformTuple = typeof ALL_PLATFORMS;
export type Platform = PlatformTuple[number];
export declare const ALL_TAGS: string[];
export type TagTuple = typeof ALL_TAGS;
export type Tag = TagTuple[number];
export type AnalyzeResult = {
    total_nloc: number;
    modules: {
        [key: string]: ModuleTypeInfo;
    };
};
export type ModuleTypeInfo = {
    count: number;
    nloc: number;
};
export type Contest = {
    pk: string;
    sk: string;
    readme: string;
    url: string;
    start_date: number;
    end_date: number;
    active: number;
    status: Status;
    prize: string;
    platform: Platform;
    tags: Tag[];
    repo_urls?: string[];
    doc_urls?: string[];
    em_stored?: number;
    cl_stored?: number;
    fl_stored?: number;
    analyze_result?: AnalyzeResult;
};
export type Status = "created" | "active" | "judging" | "finished";
export type ContestEmbeddings = {
    pk: string;
    sk: string;
    emb_q: string;
    chat_q: string;
    k: number;
    emb_res: Document[];
    chat_res: string;
};
export type ContestWithModules = Contest & {
    modules: ContestModule[];
    audit_time?: number;
    loc?: number;
};
export type ContestModule = {
    name: string;
    contest: string;
    active: number;
    url?: string;
    path?: string;
    loc?: number;
};
export type Document = {
    pageContent: string;
    metadata: Metadata;
};
export type DocumentWithLoc = Document & {
    metadata: MetadataWithLoc;
};
export type FindingDocument = Document & {
    metadata: FindingEmbMeta;
};
export type Metadata = Record<string, any> & {
    source: string;
};
export type MetadataWithLoc = Metadata & {
    loc: {
        lines: {
            from: number;
            to: number;
        };
    };
};
