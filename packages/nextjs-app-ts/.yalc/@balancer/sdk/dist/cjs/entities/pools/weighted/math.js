"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._calcInGivenOut = exports._calcOutGivenIn = void 0;
const math_1 = require("../../../utils/math");
function _calcOutGivenIn(balanceIn, weightIn, balanceOut, weightOut, amountIn, version) {
    const denominator = balanceIn + amountIn;
    const base = math_1.MathSol.divUpFixed(balanceIn, denominator);
    const exponent = math_1.MathSol.divDownFixed(weightIn, weightOut);
    const power = math_1.MathSol.powUpFixed(base, exponent, version);
    return math_1.MathSol.mulDownFixed(balanceOut, math_1.MathSol.complementFixed(power));
}
exports._calcOutGivenIn = _calcOutGivenIn;
function _calcInGivenOut(balanceIn, weightIn, balanceOut, weightOut, amountOut, version) {
    const base = math_1.MathSol.divUpFixed(balanceOut, balanceOut - amountOut);
    const exponent = math_1.MathSol.divUpFixed(weightOut, weightIn);
    const power = math_1.MathSol.powUpFixed(base, exponent, version);
    const ratio = power - math_1.WAD;
    return math_1.MathSol.mulUpFixed(balanceIn, ratio);
}
exports._calcInGivenOut = _calcInGivenOut;
//# sourceMappingURL=math.js.map