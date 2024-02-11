import { withSentry, withStreamingSentry } from "./sentry-lambda.js";
let testWithSentry = async () => {
    withSentry({
        name: "test",
        event: {},
        block: async () => {
            throw new Error("testing");
        },
    });
};
let testWithStreamingSentry = async () => {
    withStreamingSentry({
        name: "test-stream",
        event: {},
        stream: {
            write: (msg) => console.log(msg),
            end: () => console.log("end"),
        },
        block: async () => {
            throw new Error("testing stream");
        },
    });
};
testWithStreamingSentry().then(() => console.log("done"));
//# sourceMappingURL=sentry-lambda.run.js.map