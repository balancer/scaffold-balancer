"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRpcGetBlockTimestampByNumber = exports.jsonRpcFetch = void 0;
const tslib_1 = require("tslib");
const isomorphic_fetch_1 = tslib_1.__importDefault(require("isomorphic-fetch"));
const constants_1 = require("./constants");
const bytes_1 = require("@ethersproject/bytes");
const bignumber_1 = require("@ethersproject/bignumber");
async function jsonRpcFetch({ rpcUrl, from = constants_1.ZERO_ADDRESS, to, contractInterface, functionFragment, values, options, }) {
    const data = contractInterface.encodeFunctionData(functionFragment, values);
    let block;
    if (options?.block) {
        block = (0, bytes_1.hexValue)(options.block);
    }
    else {
        block = 'latest';
    }
    const rawResponse = await (0, isomorphic_fetch_1.default)(rpcUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'eth_call',
            params: [{ from, to, data }, block],
        }),
    });
    const content = await rawResponse.json();
    if (content.error) {
        throw new Error(content.error);
    }
    return contractInterface.decodeFunctionResult('getPoolData', content.result);
}
exports.jsonRpcFetch = jsonRpcFetch;
async function jsonRpcGetBlockTimestampByNumber({ rpcUrl, blockNumber, }) {
    const rawResponse = await (0, isomorphic_fetch_1.default)(rpcUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'eth_getBlockByNumber',
            params: [(0, bytes_1.hexValue)(blockNumber), false],
        }),
    });
    const content = await rawResponse.json();
    return bignumber_1.BigNumber.from(content.result.timestamp).toNumber();
}
exports.jsonRpcGetBlockTimestampByNumber = jsonRpcGetBlockTimestampByNumber;
//# sourceMappingURL=jsonRpcFetch.js.map