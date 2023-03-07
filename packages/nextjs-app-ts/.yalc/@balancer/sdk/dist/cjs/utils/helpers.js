"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInputs = void 0;
const types_1 = require("../types");
function checkInputs(tokenIn, tokenOut, swapKind, swapAmount) {
    if (tokenIn.chainId !== tokenOut.chainId || tokenIn.chainId !== swapAmount.token.chainId) {
        throw new Error('ChainId mismatch for inputs');
    }
    if ((swapKind === types_1.SwapKind.GivenIn && !tokenIn.isEqual(swapAmount.token)) ||
        (swapKind === types_1.SwapKind.GivenOut && !tokenOut.isEqual(swapAmount.token))) {
        throw new Error('Swap amount token does not match input token');
    }
}
exports.checkInputs = checkInputs;
//# sourceMappingURL=helpers.js.map