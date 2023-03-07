"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapKind = exports.PoolType = void 0;
var PoolType;
(function (PoolType) {
    PoolType["Weighted"] = "Weighted";
    PoolType["ComposableStable"] = "ComposableStable";
    PoolType["MetaStable"] = "MetaStable";
    PoolType["AaveLinear"] = "AaveLinear";
})(PoolType = exports.PoolType || (exports.PoolType = {}));
var SwapKind;
(function (SwapKind) {
    SwapKind[SwapKind["GivenIn"] = 0] = "GivenIn";
    SwapKind[SwapKind["GivenOut"] = 1] = "GivenOut";
})(SwapKind = exports.SwapKind || (exports.SwapKind = {}));
//# sourceMappingURL=types.js.map