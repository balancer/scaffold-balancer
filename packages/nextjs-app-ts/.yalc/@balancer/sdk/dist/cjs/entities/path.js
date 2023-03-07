"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathWithAmount = exports.Path = void 0;
const types_1 = require("../types");
class Path {
    constructor(tokens, pools) {
        if (pools.length === 0 || tokens.length < 2) {
            throw new Error('Invalid path: must contain at least 1 pool and 2 tokens.');
        }
        else if (tokens.length !== pools.length + 1) {
            throw new Error('Invalid path: tokens length must equal pools length + 1');
        }
        this.pools = pools;
        this.tokens = tokens;
    }
}
exports.Path = Path;
class PathWithAmount extends Path {
    constructor(tokens, pools, swapAmount, mutateBalances) {
        super(tokens, pools);
        this.printPath = [];
        this.swapAmount = swapAmount;
        this.mutateBalances = Boolean(mutateBalances);
        //call to super ensures this array access is safe
        if (tokens[0].isUnderlyingEqual(swapAmount.token)) {
            this.swapKind = types_1.SwapKind.GivenIn;
        }
        else {
            this.swapKind = types_1.SwapKind.GivenOut;
        }
        try {
            if (this.swapKind === types_1.SwapKind.GivenIn) {
                const amounts = new Array(this.tokens.length);
                amounts[0] = this.swapAmount;
                for (let i = 0; i < this.pools.length; i++) {
                    const pool = this.pools[i];
                    const outputAmount = pool.swapGivenIn(this.tokens[i], this.tokens[i + 1], amounts[i], this.mutateBalances);
                    amounts[i + 1] = outputAmount;
                    this.printPath.push({
                        pool: pool.id,
                        input: amounts[i].amount.toString() + ' ' + this.tokens[i].symbol,
                        output: outputAmount.amount.toString() + ' ' + this.tokens[i + 1].symbol,
                    });
                }
                this.outputAmount = amounts[amounts.length - 1];
                this.inputAmount = this.swapAmount;
            }
            else {
                const amounts = new Array(this.tokens.length);
                amounts[amounts.length - 1] = this.swapAmount;
                for (let i = this.pools.length; i >= 1; i--) {
                    const pool = this.pools[i - 1];
                    const inputAmount = pool.swapGivenOut(this.tokens[i - 1], this.tokens[i], amounts[i], this.mutateBalances);
                    amounts[i - 1] = inputAmount;
                    this.printPath.push({
                        pool: pool.id,
                        input: inputAmount.amount.toString() + ' ' + this.tokens[i - 1].symbol,
                        output: amounts[i].amount.toString() + ' ' + this.tokens[i].symbol,
                    });
                }
                this.printPath = this.printPath.reverse();
                this.inputAmount = amounts[0];
                this.outputAmount = this.swapAmount;
            }
        }
        catch (error) {
            throw new Error(`Invalid path, swap amount exceeds maximum for pool`);
        }
    }
    print() {
        console.table(this.printPath);
    }
}
exports.PathWithAmount = PathWithAmount;
//# sourceMappingURL=path.js.map