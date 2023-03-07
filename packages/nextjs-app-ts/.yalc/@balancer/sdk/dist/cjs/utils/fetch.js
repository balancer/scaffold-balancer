"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetry = void 0;
const tslib_1 = require("tslib");
const async_retry_1 = tslib_1.__importDefault(require("async-retry"));
const await_timeout_1 = tslib_1.__importDefault(require("await-timeout"));
async function fetchWithRetry(fetch, config = { timeout: 30000, retries: 2 }) {
    let response = null;
    await (0, async_retry_1.default)(async () => {
        const timeoutFunc = new await_timeout_1.default();
        try {
            const fetchPromise = fetch();
            const timerPromise = timeoutFunc.set(config.timeout).then(() => {
                throw new Error(`Timed out during fetchWithRetry: ${config.timeout}`);
            });
            response = await Promise.race([fetchPromise, timerPromise]);
            return;
        }
        finally {
            timeoutFunc.clear();
        }
    }, {
        retries: config.retries,
        onRetry: (err, retry) => {
            console.log(err, retry);
        },
    });
    return response;
}
exports.fetchWithRetry = fetchWithRetry;
//# sourceMappingURL=fetch.js.map