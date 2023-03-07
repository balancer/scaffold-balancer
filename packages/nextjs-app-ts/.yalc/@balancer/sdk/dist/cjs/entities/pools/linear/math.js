"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._calcBptInPerMainOut = exports._calcBptInPerWrappedOut = exports._calcWrappedInPerBptOut = exports._calcWrappedInPerMainOut = exports._calcMainInPerBptOut = exports._calcMainInPerWrappedOut = exports._calcWrappedOutPerBptIn = exports._calcMainOutPerBptIn = exports._calcBptOutPerWrappedIn = exports._calcMainOutPerWrappedIn = exports._calcBptOutPerMainIn = exports._calcWrappedOutPerMainIn = void 0;
const utils_1 = require("../../../utils/");
function _calcWrappedOutPerMainIn(mainIn, mainBalance, params) {
    // Amount out, so we round down overall.
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = _toNominal(mainBalance + mainIn, params);
    return afterNominalMain - previousNominalMain;
}
exports._calcWrappedOutPerMainIn = _calcWrappedOutPerMainIn;
function _calcBptOutPerMainIn(mainIn, mainBalance, wrappedBalance, bptSupply, params) {
    // Amount out, so we round down overall.
    if (bptSupply == 0n) {
        return _toNominal(mainIn, params);
    }
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = _toNominal(mainBalance + mainIn, params);
    const deltaNominalMain = afterNominalMain - previousNominalMain;
    const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
    return (bptSupply * deltaNominalMain) / invariant;
}
exports._calcBptOutPerMainIn = _calcBptOutPerMainIn;
function _calcMainOutPerWrappedIn(wrappedIn, mainBalance, params) {
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = previousNominalMain - wrappedIn;
    const newMainBalance = _fromNominal(afterNominalMain, params);
    return mainBalance - newMainBalance;
}
exports._calcMainOutPerWrappedIn = _calcMainOutPerWrappedIn;
function _calcBptOutPerWrappedIn(wrappedIn, mainBalance, wrappedBalance, bptSupply, params) {
    if (bptSupply === 0n) {
        return wrappedIn;
    }
    const nominalMain = _toNominal(mainBalance, params);
    const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
    const newWrappedBalance = wrappedBalance + wrappedIn;
    const newInvariant = _calcInvariant(nominalMain, newWrappedBalance);
    const newBptBalance = (bptSupply * newInvariant) / previousInvariant;
    return newBptBalance - bptSupply;
}
exports._calcBptOutPerWrappedIn = _calcBptOutPerWrappedIn;
function _calcMainOutPerBptIn(bptIn, mainBalance, wrappedBalance, bptSupply, params) {
    // Amount out, so we round down overall.
    const previousNominalMain = _toNominal(mainBalance, params);
    const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
    const deltaNominalMain = (invariant * bptIn) / bptSupply;
    const afterNominalMain = previousNominalMain - deltaNominalMain;
    const newMainBalance = _fromNominal(afterNominalMain, params);
    return mainBalance - newMainBalance;
}
exports._calcMainOutPerBptIn = _calcMainOutPerBptIn;
function _calcWrappedOutPerBptIn(bptIn, mainBalance, wrappedBalance, bptSupply, params) {
    const nominalMain = _toNominal(mainBalance, params);
    const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
    const newBptBalance = bptSupply - bptIn;
    const newWrappedBalance = (newBptBalance * previousInvariant) / bptSupply - nominalMain;
    return wrappedBalance - newWrappedBalance;
}
exports._calcWrappedOutPerBptIn = _calcWrappedOutPerBptIn;
function _calcMainInPerWrappedOut(wrappedOut, mainBalance, params) {
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = previousNominalMain + wrappedOut;
    const newMainBalance = _fromNominal(afterNominalMain, params);
    return newMainBalance - mainBalance;
}
exports._calcMainInPerWrappedOut = _calcMainInPerWrappedOut;
function _calcMainInPerBptOut(bptOut, mainBalance, wrappedBalance, bptSupply, params) {
    if (bptSupply == 0n) {
        return _fromNominal(bptOut, params);
    }
    const previousNominalMain = _toNominal(mainBalance, params);
    const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
    const deltaNominalMain = (invariant * bptOut) / bptSupply;
    const afterNominalMain = previousNominalMain + deltaNominalMain;
    const newMainBalance = _fromNominal(afterNominalMain, params);
    return newMainBalance - mainBalance;
}
exports._calcMainInPerBptOut = _calcMainInPerBptOut;
function _calcWrappedInPerMainOut(mainOut, mainBalance, params) {
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = _toNominal(mainBalance - mainOut, params);
    return previousNominalMain - afterNominalMain;
}
exports._calcWrappedInPerMainOut = _calcWrappedInPerMainOut;
function _calcWrappedInPerBptOut(bptOut, mainBalance, wrappedBalance, bptSupply, params) {
    if (bptSupply == 0n) {
        return bptOut;
    }
    const nominalMain = _toNominal(mainBalance, params);
    const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
    const newBptBalance = bptSupply + bptOut;
    const newWrappedBalance = (newBptBalance * previousInvariant) / bptSupply - nominalMain;
    return newWrappedBalance - wrappedBalance;
}
exports._calcWrappedInPerBptOut = _calcWrappedInPerBptOut;
function _calcBptInPerWrappedOut(wrappedOut, mainBalance, wrappedBalance, bptSupply, params) {
    const nominalMain = _toNominal(mainBalance, params);
    const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
    const newWrappedBalance = wrappedBalance - wrappedOut;
    const newInvariant = _calcInvariant(nominalMain, newWrappedBalance);
    const newBptBalance = (bptSupply * newInvariant) / previousInvariant;
    return bptSupply - newBptBalance;
}
exports._calcBptInPerWrappedOut = _calcBptInPerWrappedOut;
function _calcBptInPerMainOut(mainOut, mainBalance, wrappedBalance, bptSupply, params) {
    const previousNominalMain = _toNominal(mainBalance, params);
    const afterNominalMain = _toNominal(mainBalance - mainOut, params);
    const deltaNominalMain = previousNominalMain - afterNominalMain;
    const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
    return (bptSupply * deltaNominalMain) / invariant;
}
exports._calcBptInPerMainOut = _calcBptInPerMainOut;
function _calcInvariant(nominalMainBalance, wrappedBalance) {
    return nominalMainBalance + wrappedBalance;
}
function _toNominal(real, params) {
    // Fees are always rounded down: either direction would work but we need to be consistent, and rounding down
    // uses less gas.
    if (real < params.lowerTarget) {
        const fees = utils_1.MathSol.mulDownFixed(params.lowerTarget - real, params.fee);
        return real - fees;
    }
    else if (real <= params.upperTarget) {
        return real;
    }
    else {
        const fees = utils_1.MathSol.mulDownFixed(real - params.upperTarget, params.fee);
        return real - fees;
    }
}
function _fromNominal(nominal, params) {
    // Since real = nominal + fees, rounding down fees is equivalent to rounding down real.
    if (nominal < params.lowerTarget) {
        return utils_1.MathSol.divDownFixed(nominal + utils_1.MathSol.mulDownFixed(params.fee, params.lowerTarget), utils_1.WAD + params.fee);
    }
    else if (nominal <= params.upperTarget) {
        return nominal;
    }
    else {
        return utils_1.MathSol.divDownFixed(nominal - utils_1.MathSol.mulDownFixed(params.fee, params.upperTarget), utils_1.WAD - params.fee);
    }
}
//# sourceMappingURL=math.js.map