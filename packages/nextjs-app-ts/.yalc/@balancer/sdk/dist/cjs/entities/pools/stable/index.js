"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StablePool = void 0;
const types_1 = require("../../../types");
const __1 = require("../../");
const utils_1 = require("../../../utils");
const math_1 = require("./math");
class StablePoolToken extends __1.TokenAmount {
    constructor(token, amount, rate, index) {
        super(token, amount);
        this.rate = BigInt(rate);
        this.scale18 = (this.amount * this.scalar * this.rate) / utils_1.WAD;
        this.index = index;
    }
    increase(amount) {
        this.amount = this.amount + amount;
        this.scale18 = (this.amount * this.scalar * this.rate) / utils_1.WAD;
        return this;
    }
    decrease(amount) {
        this.amount = this.amount - amount;
        this.scale18 = (this.amount * this.scalar * this.rate) / utils_1.WAD;
        return this;
    }
}
class StablePool {
    static fromRawPool(chainId, pool) {
        const poolTokens = [];
        for (const t of pool.tokens) {
            if (!t.priceRate)
                throw new Error('Stable pool token does not have a price rate');
            const token = new __1.Token(chainId, t.address, t.decimals, t.symbol, t.name);
            const tokenAmount = __1.TokenAmount.fromHumanAmount(token, t.balance);
            const tokenIndex = t.index ?? pool.tokensList.findIndex(t => t === token.address);
            poolTokens.push(new StablePoolToken(token, tokenAmount.amount, (0, utils_1.unsafeFastParseEther)(t.priceRate), tokenIndex));
        }
        const totalShares = (0, utils_1.unsafeFastParseEther)(pool.totalShares);
        const amp = BigInt(pool.amp) * 1000n;
        return new StablePool(pool.id, amp, (0, utils_1.unsafeFastParseEther)(pool.swapFee), poolTokens, totalShares);
    }
    constructor(id, amp, swapFee, tokens, totalShares) {
        this.poolType = types_1.PoolType.ComposableStable;
        this.chainId = tokens[0].token.chainId;
        this.id = id;
        this.address = (0, utils_1.getPoolAddress)(id);
        this.amp = amp;
        this.swapFee = swapFee;
        this.totalShares = totalShares;
        this.tokens = tokens.sort((a, b) => a.index - b.index);
        this.tokenMap = new Map(this.tokens.map(token => [token.token.address, token]));
        this.tokenIndexMap = new Map(this.tokens.map(token => [token.token.address, token.index]));
        this.bptIndex = this.tokens.findIndex(t => t.token.address === this.address);
    }
    getNormalizedLiquidity(tokenIn, tokenOut) {
        const tIn = this.tokenMap.get(tokenIn.wrapped);
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        if (!tIn || !tOut)
            throw new Error('Pool does not contain the tokens provided');
        // console.log(`stable pool normalized liquidity: ${tOut.amount * this.amp}`);
        // TODO: Fix stable normalized liquidity calc
        return tOut.amount * this.amp;
    }
    swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
        const tInIndex = this.tokenIndexMap.get(tokenIn.wrapped);
        const tOutIndex = this.tokenIndexMap.get(tokenOut.wrapped);
        if (typeof tInIndex !== 'number' || typeof tOutIndex !== 'number') {
            throw new Error('Pool does not contain the tokens provided');
        }
        const balancesNoBpt = this.dropBptItem(this.tokens.map(t => t.scale18));
        // TODO: Fix stable swap limit
        if (swapAmount.scale18 > this.tokens[tInIndex].scale18) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const invariant = (0, math_1._calculateInvariant)(this.amp, balancesNoBpt);
        let tokenOutScale18;
        if (tokenIn.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
            const amountInWithRate = swapAmount.mulDownFixed(this.tokens[tInIndex].rate);
            tokenOutScale18 = (0, math_1._calcTokenOutGivenExactBptIn)(this.amp, [...balancesNoBpt], this.skipBptIndex(tOutIndex), amountInWithRate.scale18, this.totalShares, invariant, this.swapFee);
        }
        else if (tokenOut.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
            const amountsIn = new Array(balancesNoBpt.length).fill(0n);
            const amountInWithRate = swapAmount.mulDownFixed(this.tokens[tInIndex].rate);
            amountsIn[this.skipBptIndex(tInIndex)] = amountInWithRate.scale18;
            tokenOutScale18 = (0, math_1._calcBptOutGivenExactTokensIn)(this.amp, [...balancesNoBpt], amountsIn, this.totalShares, invariant, this.swapFee);
        }
        else {
            const amountInWithFee = this.subtractSwapFeeAmount(swapAmount);
            const amountInWithRate = amountInWithFee.mulDownFixed(this.tokens[tInIndex].rate);
            tokenOutScale18 = (0, math_1._calcOutGivenIn)(this.amp, [...balancesNoBpt], this.skipBptIndex(tInIndex), this.skipBptIndex(tOutIndex), amountInWithRate.scale18, invariant);
        }
        const amountOut = __1.TokenAmount.fromScale18Amount(tokenOut, tokenOutScale18);
        if (mutateBalances) {
            this.tokens[tInIndex].increase(swapAmount.amount);
            this.tokens[tOutIndex].decrease(amountOut.amount);
            if (tInIndex === this.bptIndex) {
                this.totalShares = this.totalShares - swapAmount.amount;
            }
            else if (tOutIndex === this.bptIndex) {
                this.totalShares = this.totalShares + amountOut.amount;
            }
        }
        return amountOut.divDownFixed(this.tokens[tOutIndex].rate);
    }
    swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
        const tInIndex = this.tokenIndexMap.get(tokenIn.wrapped);
        const tOutIndex = this.tokenIndexMap.get(tokenOut.wrapped);
        if (typeof tInIndex !== 'number' || typeof tOutIndex !== 'number') {
            throw new Error('Pool does not contain the tokens provided');
        }
        const balancesNoBpt = this.dropBptItem(this.tokens.map(t => t.scale18));
        // TODO: Fix stable swap limit
        if (swapAmount.scale18 > this.tokens[tOutIndex].scale18) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const amountOutWithRate = swapAmount.mulDownFixed(this.tokens[tOutIndex].rate);
        const invariant = (0, math_1._calculateInvariant)(this.amp, balancesNoBpt);
        let amountIn;
        if (tokenIn.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
            const amountsOut = new Array(balancesNoBpt.length).fill(0n);
            amountsOut[this.skipBptIndex(tOutIndex)] = amountOutWithRate.scale18;
            const tokenInScale18 = (0, math_1._calcBptInGivenExactTokensOut)(this.amp, [...balancesNoBpt], amountsOut, this.totalShares, invariant, this.swapFee);
            amountIn = __1.TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true).divDownFixed(this.tokens[tInIndex].rate);
        }
        else if (tokenOut.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
            const tokenInScale18 = (0, math_1._calcTokenInGivenExactBptOut)(this.amp, [...balancesNoBpt], this.skipBptIndex(tInIndex), amountOutWithRate.scale18, this.totalShares, invariant, this.swapFee);
            amountIn = __1.TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true).divDownFixed(this.tokens[tInIndex].rate);
        }
        else {
            const tokenInScale18 = (0, math_1._calcInGivenOut)(this.amp, [...balancesNoBpt], this.skipBptIndex(tInIndex), this.skipBptIndex(tOutIndex), amountOutWithRate.scale18, invariant);
            const amountInWithoutFee = __1.TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true);
            const amountInWithFee = this.addSwapFeeAmount(amountInWithoutFee);
            amountIn = amountInWithFee.divDownFixed(this.tokens[tInIndex].rate);
        }
        if (mutateBalances) {
            this.tokens[tInIndex].increase(amountIn.amount);
            this.tokens[tOutIndex].decrease(swapAmount.amount);
            if (tInIndex === this.bptIndex) {
                this.totalShares = this.totalShares - amountIn.amount;
            }
            else if (tOutIndex === this.bptIndex) {
                this.totalShares = this.totalShares + swapAmount.amount;
            }
        }
        return amountIn;
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
    skipBptIndex(index) {
        if (index === this.bptIndex)
            throw new Error('Cannot skip BPT index');
        return index < this.bptIndex ? index : index - 1;
    }
    dropBptItem(amounts) {
        const amountsWithoutBpt = new Array(amounts.length - 1).fill(0n);
        for (let i = 0; i < amountsWithoutBpt.length; i++) {
            amountsWithoutBpt[i] = amounts[i < this.bptIndex ? i : i + 1];
        }
        return amountsWithoutBpt;
    }
}
exports.StablePool = StablePool;
//# sourceMappingURL=index.js.map