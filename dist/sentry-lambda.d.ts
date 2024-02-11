export declare let setSentryProjectName: (name: string) => void;
export type SentryLevel = "error" | "warning" | "info" | "debug" | "fatal";
export type SentryInterval = "daily" | "hourly";
export declare let sentryMessage: (message: string, level?: SentryLevel) => Promise<void>;
export declare let sentryError: (message: string, payload?: any, sentryInterval?: SentryInterval) => Promise<void>;
export declare let withSentry: (props: {
    name: string;
    event: any;
    block: () => Promise<any>;
}) => Promise<any>;
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 */
export declare let withStreamingSentry: (props: {
    name: string;
    event: any;
    stream: any;
    block: () => Promise<any>;
}) => Promise<any>;
export declare const isCorsRequest: (event: any) => {
    statusCode: number;
    body: string;
    headers: {
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
        "Access-Control-Allow-Credentials": boolean;
    };
} | undefined;
export declare const corsHeaders: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Credentials": boolean;
};
