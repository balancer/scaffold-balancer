"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedPool = void 0;
const types_1 = require("../../../types");
const __1 = require("../../");
const utils_1 = require("../../../utils");
const math_1 = require("./math");
class WeightedPoolToken extends __1.TokenAmount {
    constructor(token, amount, weight, index) {
        super(token, amount);
        this.weight = BigInt(weight);
        this.index = index;
    }
    increase(amount) {
        this.amount = this.amount + amount;
        this.scale18 = this.amount * this.scalar;
        return this;
    }
    decrease(amount) {
        this.amount = this.amount - amount;
        this.scale18 = this.amount * this.scalar;
        return this;
    }
}
class WeightedPool {
    static fromRawPool(chainId, pool) {
        const poolTokens = [];
        for (const t of pool.tokens) {
            if (!t.weight) {
                throw new Error('Weighted pool token does not have a weight');
            }
            const token = new __1.Token(chainId, t.address, t.decimals, t.symbol, t.name);
            const tokenAmount = __1.TokenAmount.fromHumanAmount(token, t.balance);
            poolTokens.push(new WeightedPoolToken(token, tokenAmount.amount, (0, utils_1.unsafeFastParseEther)(t.weight), t.index));
        }
        return new WeightedPool(pool.id, pool.poolTypeVersion, (0, utils_1.unsafeFastParseEther)(pool.swapFee), poolTokens);
    }
    constructor(id, poolTypeVersion, swapFee, tokens) {
        this.poolType = types_1.PoolType.Weighted;
        this.MAX_IN_RATIO = 300000000000000000n; // 0.3
        this.MAX_OUT_RATIO = 300000000000000000n; // 0.3
        this.chainId = tokens[0].token.chainId;
        this.id = id;
        this.poolTypeVersion = poolTypeVersion;
        this.address = (0, utils_1.getPoolAddress)(id);
        this.swapFee = swapFee;
        this.tokens = tokens;
        this.tokenMap = new Map(tokens.map(token => [token.token.address, token]));
    }
    getNormalizedLiquidity(tokenIn, tokenOut) {
        const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
        return (tIn.amount * tOut.weight) / (tIn.weight + tOut.weight);
    }
    getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
        const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
        if (swapKind === types_1.SwapKind.GivenIn) {
            return (tIn.amount * this.MAX_IN_RATIO) / utils_1.WAD;
        }
        else {
            return (tOut.amount * this.MAX_OUT_RATIO) / utils_1.WAD;
        }
    }
    swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
        const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
        if (swapAmount.amount > this.getLimitAmountSwap(tokenIn, tokenOut, types_1.SwapKind.GivenIn)) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const amountWithFee = this.subtractSwapFeeAmount(swapAmount);
        const tokenOutScale18 = (0, math_1._calcOutGivenIn)(tIn.scale18, tIn.weight, tOut.scale18, tOut.weight, amountWithFee.scale18, this.poolTypeVersion);
        const tokenOutAmount = __1.TokenAmount.fromScale18Amount(tokenOut, tokenOutScale18);
        if (mutateBalances) {
            tIn.increase(swapAmount.amount);
            tOut.decrease(tokenOutAmount.amount);
        }
        return tokenOutAmount;
    }
    swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
        const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
        if (swapAmount.amount > this.getLimitAmountSwap(tokenIn, tokenOut, types_1.SwapKind.GivenOut)) {
            throw new Error('Swap amount exceeds the pool limit');
        }
        const tokenInScale18 = (0, math_1._calcInGivenOut)(tIn.scale18, tIn.weight, tOut.scale18, tOut.weight, swapAmount.scale18, this.poolTypeVersion);
        const tokenInAmount = this.addSwapFeeAmount(__1.TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true));
        if (mutateBalances) {
            tIn.increase(tokenInAmount.amount);
            tOut.decrease(swapAmount.amount);
        }
        return tokenInAmount;
    }
    subtractSwapFeeAmount(amount) {
        const feeAmount = amount.mulUpFixed(this.swapFee);
        return amount.sub(feeAmount);
    }
    addSwapFeeAmount(amount) {
        return amount.divUpFixed(utils_1.MathSol.complementFixed(this.swapFee));
    }
    getRequiredTokenPair(tokenIn, tokenOut) {
        const tIn = this.tokenMap.get(tokenIn.wrapped);
        const tOut = this.tokenMap.get(tokenOut.wrapped);
        if (!tIn || !tOut) {
            throw new Error('Pool does not contain the tokens provided');
        }
        return { tIn, tOut };
    }
}
exports.WeightedPool = WeightedPool;
//# sourceMappingURL=index.js.map