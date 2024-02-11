import { Metadata, Platform, Tag } from "./types-contest.js";
export declare enum Severity {
    NON_CRITICAL = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}
export type FindingSource = Platform;
export type Finding = {
    pk: string;
    name: string;
    platform: FindingSource;
    severity?: Severity;
    tags: Tag[];
    url?: string;
    content?: string;
    c_name?: string;
};
export type FindingEmbMeta = Metadata & {
    platform: Platform;
    c_date: number;
    c_name: string;
    severity?: Severity;
};
export type LatestFinding = Finding;
export type LatestContest = {
    c_url: string;
    c_name: string;
    c_platform: Platform;
};
export type LatestContestWithFindings = {
    contest: LatestContest;
    findings: LatestFinding[];
};
