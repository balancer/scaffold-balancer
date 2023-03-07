"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getTokenBalanceGivenInvariantAndAllOtherBalances = exports._calcTokenOutGivenExactBptIn = exports._calcBptInGivenExactTokensOut = exports._calcTokenInGivenExactBptOut = exports._calcBptOutGivenExactTokensIn = exports._calcInGivenOut = exports._calcOutGivenIn = exports._calculateInvariant = void 0;
const AMP_PRECISION = 1000n;
const utils_1 = require("../../../utils/");
function _calculateInvariant(amplificationParameter, balances, roundUp) {
    let sum = 0n;
    const numTokens = balances.length;
    for (let i = 0; i < numTokens; i++) {
        sum += balances[i];
    }
    if (sum == 0n) {
        return 0n;
    }
    let prevInvariant;
    let invariant = sum;
    const ampTimesTotal = amplificationParameter * BigInt(numTokens);
    for (let i = 0; i < 255; i++) {
        let D_P = invariant;
        for (let j = 0; j < numTokens; j++) {
            D_P = roundUp
                ? utils_1.MathSol.divUp(D_P * invariant, balances[j] * BigInt(numTokens))
                : (D_P * invariant) / (balances[j] * BigInt(numTokens));
        }
        prevInvariant = invariant;
        invariant = roundUp
            ? utils_1.MathSol.divUp(((ampTimesTotal * sum) / AMP_PRECISION + D_P * BigInt(numTokens)) * invariant, utils_1.MathSol.divUp((ampTimesTotal - AMP_PRECISION) * invariant, AMP_PRECISION) +
                (BigInt(numTokens) + 1n) * D_P)
            : (((ampTimesTotal * sum) / AMP_PRECISION + D_P * BigInt(numTokens)) * invariant) /
                (((ampTimesTotal - AMP_PRECISION) * invariant) / AMP_PRECISION +
                    (BigInt(numTokens) + 1n) * D_P);
        if (invariant > prevInvariant) {
            if (invariant - prevInvariant <= 1n) {
                return invariant;
            }
        }
        else if (prevInvariant - invariant <= 1n) {
            return invariant;
        }
    }
    throw new Error('Errors.STABLE_INVARIANT_DIDNT_CONVERGE');
}
exports._calculateInvariant = _calculateInvariant;
function _calcOutGivenIn(amplificationParameter, balances, tokenIndexIn, tokenIndexOut, tokenAmountIn, invariant) {
    balances[tokenIndexIn] = balances[tokenIndexIn] + tokenAmountIn;
    const finalBalanceOut = _getTokenBalanceGivenInvariantAndAllOtherBalances(amplificationParameter, balances, invariant, tokenIndexOut);
    balances[tokenIndexIn] = balances[tokenIndexIn] - tokenAmountIn;
    return balances[tokenIndexOut] - finalBalanceOut - 1n;
}
exports._calcOutGivenIn = _calcOutGivenIn;
function _calcInGivenOut(amplificationParameter, balances, tokenIndexIn, tokenIndexOut, tokenAmountOut, invariant) {
    balances[tokenIndexOut] = balances[tokenIndexOut] - tokenAmountOut;
    const finalBalanceIn = _getTokenBalanceGivenInvariantAndAllOtherBalances(amplificationParameter, balances, invariant, tokenIndexIn);
    balances[tokenIndexOut] = balances[tokenIndexOut] - tokenAmountOut;
    return finalBalanceIn - balances[tokenIndexIn] + 1n;
}
exports._calcInGivenOut = _calcInGivenOut;
function _calcBptOutGivenExactTokensIn(amp, balances, amountsIn, bptTotalSupply, currentInvariant, swapFee) {
    let sumBalances = 0n;
    for (let i = 0; i < balances.length; i++) {
        sumBalances += balances[i];
    }
    const balanceRatiosWithFee = new Array(amountsIn.length);
    let invariantRatioWithFees = 0n;
    for (let i = 0; i < balances.length; i++) {
        const currentWeight = utils_1.MathSol.divDownFixed(balances[i], sumBalances);
        balanceRatiosWithFee[i] = utils_1.MathSol.divDownFixed(balances[i] + amountsIn[i], balances[i]);
        invariantRatioWithFees =
            invariantRatioWithFees + utils_1.MathSol.mulDownFixed(balanceRatiosWithFee[i], currentWeight);
    }
    const newBalances = new Array(balances.length);
    for (let i = 0; i < balances.length; i++) {
        let amountInWithoutFee;
        if (balanceRatiosWithFee[i] > invariantRatioWithFees) {
            const nonTaxableAmount = utils_1.MathSol.mulDownFixed(balances[i], invariantRatioWithFees - utils_1.WAD);
            const taxableAmount = amountsIn[i] - nonTaxableAmount;
            amountInWithoutFee =
                nonTaxableAmount + utils_1.MathSol.mulDownFixed(taxableAmount, utils_1.WAD - swapFee);
        }
        else {
            amountInWithoutFee = amountsIn[i];
        }
        newBalances[i] = balances[i] + amountInWithoutFee;
    }
    const newInvariant = _calculateInvariant(amp, newBalances);
    const invariantRatio = utils_1.MathSol.divDownFixed(newInvariant, currentInvariant);
    if (invariantRatio > utils_1.WAD) {
        return utils_1.MathSol.mulDownFixed(bptTotalSupply, invariantRatio - utils_1.WAD);
    }
    else {
        return 0n;
    }
}
exports._calcBptOutGivenExactTokensIn = _calcBptOutGivenExactTokensIn;
function _calcTokenInGivenExactBptOut(amp, balances, tokenIndex, bptAmountOut, bptTotalSupply, currentInvariant, swapFee) {
    const newInvariant = utils_1.MathSol.mulUpFixed(utils_1.MathSol.divUpFixed(bptTotalSupply + bptAmountOut, bptTotalSupply), currentInvariant);
    const newBalanceTokenIndex = _getTokenBalanceGivenInvariantAndAllOtherBalances(amp, balances, newInvariant, tokenIndex);
    const amountInWithoutFee = newBalanceTokenIndex - balances[tokenIndex];
    let sumBalances = 0n;
    for (let i = 0; i < balances.length; i++) {
        sumBalances += balances[i];
    }
    const currentWeight = utils_1.MathSol.divDownFixed(balances[tokenIndex], sumBalances);
    const taxablePercentage = utils_1.MathSol.complementFixed(currentWeight);
    const taxableAmount = utils_1.MathSol.mulUpFixed(amountInWithoutFee, taxablePercentage);
    const nonTaxableAmount = amountInWithoutFee - taxableAmount;
    return nonTaxableAmount + utils_1.MathSol.divUpFixed(taxableAmount, utils_1.WAD - swapFee);
}
exports._calcTokenInGivenExactBptOut = _calcTokenInGivenExactBptOut;
function _calcBptInGivenExactTokensOut(amp, balances, amountsOut, bptTotalSupply, currentInvariant, swapFee) {
    let sumBalances = 0n;
    for (let i = 0; i < balances.length; i++) {
        sumBalances += balances[i];
    }
    const balanceRatiosWithoutFee = new Array(amountsOut.length);
    let invariantRatioWithoutFees = 0n;
    for (let i = 0; i < balances.length; i++) {
        const currentWeight = utils_1.MathSol.divUpFixed(balances[i], sumBalances);
        balanceRatiosWithoutFee[i] = utils_1.MathSol.divUpFixed(balances[i] - amountsOut[i], balances[i]);
        invariantRatioWithoutFees += utils_1.MathSol.mulUpFixed(balanceRatiosWithoutFee[i], currentWeight);
    }
    const newBalances = new Array(balances.length);
    for (let i = 0; i < balances.length; i++) {
        let amountOutWithFee;
        if (invariantRatioWithoutFees > balanceRatiosWithoutFee[i]) {
            const nonTaxableAmount = utils_1.MathSol.mulDownFixed(balances[i], utils_1.MathSol.complementFixed(invariantRatioWithoutFees));
            const taxableAmount = amountsOut[i] - nonTaxableAmount;
            amountOutWithFee = nonTaxableAmount + utils_1.MathSol.divUpFixed(taxableAmount, utils_1.WAD - swapFee);
        }
        else {
            amountOutWithFee = amountsOut[i];
        }
        newBalances[i] = balances[i] - amountOutWithFee;
    }
    const newInvariant = _calculateInvariant(amp, newBalances);
    const invariantRatio = utils_1.MathSol.divDownFixed(newInvariant, currentInvariant);
    return utils_1.MathSol.mulUpFixed(bptTotalSupply, utils_1.MathSol.complementFixed(invariantRatio));
}
exports._calcBptInGivenExactTokensOut = _calcBptInGivenExactTokensOut;
function _calcTokenOutGivenExactBptIn(amp, balances, tokenIndex, bptAmountIn, bptTotalSupply, currentInvariant, swapFee) {
    const newInvariant = utils_1.MathSol.mulUpFixed(utils_1.MathSol.divUpFixed(bptTotalSupply - bptAmountIn, bptTotalSupply), currentInvariant);
    const newBalanceTokenIndex = _getTokenBalanceGivenInvariantAndAllOtherBalances(amp, balances, newInvariant, tokenIndex);
    const amountOutWithoutFee = balances[tokenIndex] - newBalanceTokenIndex;
    let sumBalances = 0n;
    for (let i = 0; i < balances.length; i++) {
        sumBalances += balances[i];
    }
    const currentWeight = utils_1.MathSol.divDownFixed(balances[tokenIndex], sumBalances);
    const taxablePercentage = utils_1.MathSol.complementFixed(currentWeight);
    const taxableAmount = utils_1.MathSol.mulUpFixed(amountOutWithoutFee, taxablePercentage);
    const nonTaxableAmount = amountOutWithoutFee - taxableAmount;
    return nonTaxableAmount + utils_1.MathSol.mulDownFixed(taxableAmount, utils_1.WAD - swapFee);
}
exports._calcTokenOutGivenExactBptIn = _calcTokenOutGivenExactBptIn;
function _getTokenBalanceGivenInvariantAndAllOtherBalances(amplificationParameter, balances, invariant, tokenIndex) {
    const ampTimesTotal = amplificationParameter * BigInt(balances.length);
    let sum = balances[0];
    let P_D = balances[0] * BigInt(balances.length);
    for (let j = 1; j < balances.length; j++) {
        P_D = (P_D * balances[j] * BigInt(balances.length)) / invariant;
        sum += balances[j];
    }
    sum = sum - balances[tokenIndex];
    const inv2 = invariant * invariant;
    const c = utils_1.MathSol.divUp(inv2, ampTimesTotal * P_D) * AMP_PRECISION * balances[tokenIndex];
    const b = sum + (invariant / ampTimesTotal) * AMP_PRECISION;
    let prevTokenBalance = 0n;
    let tokenBalance = utils_1.MathSol.divUp(inv2 + c, invariant + b);
    for (let i = 0; i < 255; i++) {
        prevTokenBalance = tokenBalance;
        tokenBalance = utils_1.MathSol.divUp(tokenBalance * tokenBalance + c, tokenBalance * 2n + b - invariant);
        if (tokenBalance > prevTokenBalance) {
            if (tokenBalance - prevTokenBalance <= 1n) {
                return tokenBalance;
            }
        }
        else if (prevTokenBalance - tokenBalance <= 1n) {
            return tokenBalance;
        }
    }
    throw new Error('Errors.STABLE_GET_BALANCE_DIDNT_CONVERGE');
}
exports._getTokenBalanceGivenInvariantAndAllOtherBalances = _getTokenBalanceGivenInvariantAndAllOtherBalances;
//# sourceMappingURL=math.js.map