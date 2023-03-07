"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearPool = void 0;
const types_1 = require("../../../types");
const __1 = require("../../");
const utils_1 = require("../../../utils");
const math_1 = require("./math");
const ONE = (0, utils_1.unsafeFastParseEther)('1');
const MAX_RATIO = (0, utils_1.unsafeFastParseEther)('10');
const MAX_TOKEN_BALANCE = utils_1.MAX_UINT112 - 1n;
class BPT extends __1.TokenAmount {
    constructor(token, amount, index) {
        super(token, amount);
        this.rate = utils_1.WAD;
        this.virtualBalance = MAX_TOKEN_BALANCE - this.amount;
        this.index = index;
    }
}
class WrappedToken extends __1.TokenAmount {
    constructor(token, amount, rate, index) {
        super(token, amount);
        this.rate = BigInt(rate);
        this.scale18 = (this.amount * this.scalar * this.rate) / utils_1.WAD;
        this.index = index;
    }
}
class LinearPool {
    static fromRawPool(chainId, pool) {
        const orderedTokens = pool.tokens.sort((a, b) => a.index - b.index);
        const swapFee = (0, utils_1.unsafeFastParseEther)(pool.swapFee);
        const mT = orderedTokens[pool.mainIndex];
        const mToken = new __1.Token(chainId, mT.address, mT.decimals, mT.symbol, mT.name);
        const lowerTarget = __1.TokenAmount.fromHumanAmount(mToken, pool.lowerTarget);
        const upperTarget = __1.TokenAmount.fromHumanAmount(mToken, pool.upperTarget);
        const mTokenAmount = __1.TokenAmount.fromHumanAmount(mToken, mT.balance);
        const wT = orderedTokens[pool.wrappedIndex];
        const wTRate = (0, utils_1.unsafeFastParseEther)(wT.priceRate || '1.0');
        const wToken = new __1.Token(chainId, wT.address, wT.decimals, wT.symbol, wT.name);
        const wTokenAmount = __1.TokenAmount.fromHumanAmount(wToken, wT.balance);
        const wrappedToken = new WrappedToken(wToken, wTokenAmount.amount, wTRate, wT.index);
        const bptIndex = orderedTokens.findIndex(t => t.address === pool.address);
        const bT = orderedTokens[bptIndex];
        const bToken = new __1.Token(chainId, bT.address, bT.decimals, bT.symbol, bT.name);
        const bTokenAmount = __1.TokenAmount.fromHumanAmount(bToken, bT.balance);
        const bptToken = new BPT(bToken, bTokenAmount.amount, bT.index);
        const params = {
            fee: swapFee,
            rate: wTRate,
            lowerTarget: lowerTarget.scale18,
            upperTarget: upperTarget.scale18,
        };
        return new LinearPool(pool.id, pool.poolTypeVersion, params, mTokenAmount, wrappedToken, bptToken);
    }
    constructor(id, poolTypeVersion, params, mainToken, wrappedToken, bptToken) {
        this.poolType = types_1.PoolType.AaveLinear;
        this.chainId = mainToken.token.chainId;
        this.id = id;
        this.poolTypeVersion = poolTypeVersion;
        this.swapFee = params.fee;
        this.mainToken = mainToken;
        this.wrappedToken = wrappedToken;
        this.bptToken = bptToken;
        this.address = (0, utils_1.getPoolAddress)(id);
        this.params = params;
        this.tokens = [this.mainToken, this.wrappedToken, this.bptToken];
        this.tokenMap = new Map(this.tokens.map(token => [token.token.address, token]));
    }
    getNormalizedLiquidity(tokenIn, tokenOut) {
        const tIn = this.tokenMap.get(tokenIn.wrapped);
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        if (!tIn || !tOut)
            throw new Error('Pool does not contain the tokens provided');
        // TODO: Fix linear normalized liquidity calc
        return tOut.amount;
    }
    swapGivenIn(tokenIn, tokenOut, swapAmount) {
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        let output;
        if (tokenIn.isEqual(this.mainToken.token)) {
            if (tokenOut.isEqual(this.wrappedToken.token)) {
                output = this._exactMainTokenInForWrappedOut(swapAmount);
                output = output.divDownFixed(this.wrappedToken.rate);
            }
            else {
                output = this._exactMainTokenInForBptOut(swapAmount);
            }
        }
        else if (tokenIn.isEqual(this.wrappedToken.token)) {
            swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
            if (tokenOut.isEqual(this.mainToken.token)) {
                output = this._exactWrappedTokenInForMainOut(swapAmount);
            }
            else {
                output = this._exactWrappedTokenInForBptOut(swapAmount);
            }
        }
        else if (tokenIn.isEqual(this.bptToken.token)) {
            if (tokenOut.isEqual(this.mainToken.token)) {
                output = this._exactBptInForMainOut(swapAmount);
            }
            else {
                output = this._exactBptInForWrappedOut(swapAmount);
                output = output.divDownFixed(this.wrappedToken.rate);
            }
        }
        else {
            throw new Error('Pool does not contain the tokens provided');
        }
        if (output.amount > (tOut?.amount || 0n)) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        return output;
    }
    swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        if (swapAmount.amount > (tOut?.amount || 0n)) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        let input;
        if (tokenIn.isEqual(this.mainToken.token)) {
            if (tokenOut.isEqual(this.wrappedToken.token)) {
                swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
                input = this._mainTokenInForExactWrappedOut(swapAmount);
            }
            else {
                input = this._mainTokenInForExactBptOut(swapAmount);
            }
        }
        else if (tokenIn.isEqual(this.wrappedToken.token)) {
            if (tokenOut.isEqual(this.mainToken.token)) {
                input = this._wrappedTokenInForExactMainOut(swapAmount);
            }
            else {
                input = this._wrappedTokenInForExactBptOut(swapAmount);
            }
            input = input.mulDownFixed(this.wrappedToken.rate);
        }
        else if (tokenIn.isEqual(this.bptToken.token)) {
            if (tokenOut.isEqual(this.mainToken.token)) {
                input = this._bptInForExactMainOut(swapAmount);
            }
            else {
                swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
                input = this._bptInForExactWrappedOut(swapAmount);
            }
        }
        else {
            throw new Error('Pool does not contain the tokens provided');
        }
        return input;
    }
    getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
        const tIn = this.tokenMap.get(tokenIn.wrapped);
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        if (!tIn || !tOut)
            throw new Error('Pool does not contain the tokens provided');
        if (swapKind === types_1.SwapKind.GivenIn) {
            if (tokenOut.isEqual(this.bptToken.token)) {
                // Swapping to BPT allows for a very large amount so using pre-minted amount as estimation
                return MAX_TOKEN_BALANCE;
            }
            else {
                const amount = __1.TokenAmount.fromRawAmount(tokenOut, (tOut.amount * utils_1.ALMOST_ONE) / ONE);
                return this.swapGivenOut(tokenIn, tokenOut, amount).amount;
            }
        }
        else {
            if (tokenOut.isEqual(this.bptToken.token)) {
                return (tOut.amount * MAX_RATIO) / ONE;
            }
            else {
                return (tOut.amount * utils_1.ALMOST_ONE) / ONE;
            }
        }
    }
    _exactMainTokenInForWrappedOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcWrappedOutPerMainIn)(swapAmount.scale18, this.mainToken.scale18, this.params);
        return __1.TokenAmount.fromScale18Amount(this.wrappedToken.token, tokenOutScale18);
    }
    _exactMainTokenInForBptOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcBptOutPerMainIn)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.bptToken.token, tokenOutScale18);
    }
    _exactWrappedTokenInForMainOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcMainOutPerWrappedIn)(swapAmount.scale18, this.mainToken.scale18, this.params);
        return __1.TokenAmount.fromScale18Amount(this.mainToken.token, tokenOutScale18);
    }
    _exactWrappedTokenInForBptOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcBptOutPerWrappedIn)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.bptToken.token, tokenOutScale18);
    }
    _exactBptInForMainOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcMainOutPerBptIn)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.mainToken.token, tokenOutScale18);
    }
    _exactBptInForWrappedOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcWrappedOutPerBptIn)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.wrappedToken.token, tokenOutScale18);
    }
    _mainTokenInForExactWrappedOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcMainInPerWrappedOut)(swapAmount.scale18, this.mainToken.scale18, this.params);
        return __1.TokenAmount.fromScale18Amount(this.mainToken.token, tokenOutScale18, true);
    }
    _mainTokenInForExactBptOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcMainInPerBptOut)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.mainToken.token, tokenOutScale18, true);
    }
    _wrappedTokenInForExactMainOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcWrappedInPerMainOut)(swapAmount.scale18, this.mainToken.scale18, this.params);
        return __1.TokenAmount.fromScale18Amount(this.wrappedToken.token, tokenOutScale18, true);
    }
    _wrappedTokenInForExactBptOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcWrappedInPerBptOut)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.wrappedToken.token, tokenOutScale18, true);
    }
    _bptInForExactMainOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcBptInPerMainOut)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.bptToken.token, tokenOutScale18, true);
    }
    _bptInForExactWrappedOut(swapAmount) {
        const tokenOutScale18 = (0, math_1._calcBptInPerWrappedOut)(swapAmount.scale18, this.mainToken.scale18, this.wrappedToken.scale18, this.bptToken.virtualBalance, this.params);
        return __1.TokenAmount.fromScale18Amount(this.bptToken.token, tokenOutScale18, true);
    }
}
exports.LinearPool = LinearPool;
//# sourceMappingURL=index.js.map