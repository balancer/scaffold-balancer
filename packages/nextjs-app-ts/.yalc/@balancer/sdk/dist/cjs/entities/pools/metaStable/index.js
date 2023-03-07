"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaStablePool = void 0;
const types_1 = require("../../../types");
const __1 = require("../../");
const utils_1 = require("../../../utils");
const math_1 = require("../stable/math");
class StablePoolToken extends __1.TokenAmount {
    constructor(token, amount, rate, index) {
        super(token, amount);
        this.rate = BigInt(rate);
        this.scale18 = (this.amount * this.scalar * this.rate) / utils_1.WAD;
        this.index = index;
    }
}
class MetaStablePool {
    static fromRawPool(chainId, pool) {
        const poolTokens = [];
        for (const t of pool.tokens) {
            if (!t.priceRate)
                throw new Error('Meta Stable pool token does not have a price rate');
            const token = new __1.Token(chainId, t.address, t.decimals, t.symbol, t.name);
            const tokenAmount = __1.TokenAmount.fromHumanAmount(token, t.balance);
            const tokenIndex = t.index ?? pool.tokensList.findIndex(t => t === token.address);
            poolTokens.push(new StablePoolToken(token, tokenAmount.amount, (0, utils_1.unsafeFastParseEther)(t.priceRate), tokenIndex));
        }
        const amp = BigInt(pool.amp) * 1000n;
        return new MetaStablePool(pool.id, amp, (0, utils_1.unsafeFastParseEther)(pool.swapFee), poolTokens);
    }
    constructor(id, amp, swapFee, tokens) {
        this.poolType = types_1.PoolType.MetaStable;
        this.chainId = tokens[0].token.chainId;
        this.id = id;
        this.address = (0, utils_1.getPoolAddress)(id);
        this.amp = amp;
        this.swapFee = swapFee;
        this.tokens = tokens.sort((a, b) => a.index - b.index);
        this.tokenMap = new Map(this.tokens.map(token => [token.token.address, token]));
        this.tokenIndexMap = new Map(this.tokens.map(token => [token.token.address, token.index]));
    }
    getNormalizedLiquidity(tokenIn, tokenOut) {
        const tIn = this.tokenMap.get(tokenIn.address);
        const tOut = this.tokenMap.get(tokenOut.address);
        if (!tIn || !tOut)
            throw new Error('Pool does not contain the tokens provided');
        // TODO: Fix stable normalized liquidity calc
        return tOut.amount * this.amp;
    }
    swapGivenIn(tokenIn, tokenOut, swapAmount) {
        const tInIndex = this.tokenIndexMap.get(tokenIn.address);
        const tOutIndex = this.tokenIndexMap.get(tokenOut.address);
        if (typeof tInIndex !== 'number' || typeof tOutIndex !== 'number') {
            console.debug(`${this.id} ${tokenIn.symbol} ${tokenIn.address} ${tokenOut.symbol} ${tokenOut.address}`);
            throw new Error('Pool does not contain the tokens provided');
        }
        if (swapAmount.amount > this.tokens[tInIndex].amount) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const amountInWithFee = this.subtractSwapFeeAmount(swapAmount);
        const amountInWithRate = amountInWithFee.mulDownFixed(this.tokens[tInIndex].rate);
        const balances = this.tokens.map(t => t.scale18);
        const invariant = (0, math_1._calculateInvariant)(this.amp, [...balances], true);
        const tokenOutScale18 = (0, math_1._calcOutGivenIn)(this.amp, [...balances], tInIndex, tOutIndex, amountInWithRate.scale18, invariant);
        const amountOut = __1.TokenAmount.fromScale18Amount(tokenOut, tokenOutScale18);
        return amountOut.divDownFixed(this.tokens[tOutIndex].rate);
    }
    swapGivenOut(tokenIn, tokenOut, swapAmount) {
        const tInIndex = this.tokenIndexMap.get(tokenIn.address);
        const tOutIndex = this.tokenIndexMap.get(tokenOut.address);
        if (typeof tInIndex !== 'number' || typeof tOutIndex !== 'number') {
            console.debug(`${this.id} ${tokenIn.symbol} ${tokenIn.address} ${tokenOut.symbol} ${tokenOut.address}`);
            throw new Error('Pool does not contain the tokens provided');
        }
        if (swapAmount.amount > this.tokens[tOutIndex].amount) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const amountOutWithRate = swapAmount.mulDownFixed(this.tokens[tOutIndex].rate);
        const balances = this.tokens.map(t => t.scale18);
        const invariant = (0, math_1._calculateInvariant)(this.amp, balances, true);
        const tokenInScale18 = (0, math_1._calcInGivenOut)(this.amp, [...balances], tInIndex, tOutIndex, amountOutWithRate.scale18, invariant);
        const amountIn = __1.TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true);
        const amountInWithFee = this.addSwapFeeAmount(amountIn);
        return amountInWithFee.divDownFixed(this.tokens[tInIndex].rate);
    }
    subtractSwapFeeAmount(amount) {
        const feeAmount = amount.mulUpFixed(this.swapFee);
        return amount.sub(feeAmount);
    }
    addSwapFeeAmount(amount) {
        return amount.divUpFixed(utils_1.MathSol.complementFixed(this.swapFee));
    }
    getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
        const tIn = this.tokenMap.get(tokenIn.address);
        const tOut = this.tokenMap.get(tokenOut.address);
        if (!tIn || !tOut)
            throw new Error('Pool does not contain the tokens provided');
        if (swapKind === types_1.SwapKind.GivenIn) {
            // Return max valid amount of tokenIn
            // As an approx - use almost the total balance of token out as we can add any amount of tokenIn and expect some back
            return (tIn.amount * utils_1.ALMOST_ONE) / tIn.rate;
        }
        else {
            // Return max amount of tokenOut - approx is almost all balance
            return (tOut.amount * utils_1.ALMOST_ONE) / tOut.rate;
        }
    }
}
exports.MetaStablePool = MetaStablePool;
//# sourceMappingURL=index.js.map