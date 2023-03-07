import { PathWithAmount } from './path';
import { TokenAmount } from './tokenAmount';
import { SwapKind } from '../types';
import { DEFAULT_USERDATA, DEFAULT_FUND_MANAGMENT, ZERO_ADDRESS, NATIVE_ASSETS } from '../utils';
import { Contract } from '@ethersproject/contracts';
import { Interface } from '@ethersproject/abi';
import balancerQueriesAbi from '../abi/BalancerQueries.json';
// A Swap can be a single or multiple paths
export class Swap {
    constructor({ paths, swapKind }) {
        if (paths.length === 0)
            throw new Error('Invalid swap: must contain at least 1 path.');
        // Recalculate paths while mutating pool balances
        this.paths = paths.map(path => new PathWithAmount(path.tokens, path.pools, path.swapAmount, true));
        this.swapKind = swapKind;
        this.isBatchSwap = paths.length > 1 || paths[0].pools.length > 1;
        this.assets = [
            ...new Set(paths
                .map(p => p.tokens)
                .flat()
                .map(t => t.address)),
        ];
        let swaps;
        if (this.isBatchSwap) {
            swaps = [];
            if (this.swapKind === SwapKind.GivenIn) {
                this.paths.map(p => {
                    p.pools.map((pool, i) => {
                        swaps.push({
                            poolId: pool.id,
                            assetInIndex: this.assets.indexOf(p.tokens[i].address),
                            assetOutIndex: this.assets.indexOf(p.tokens[i + 1].address),
                            amount: i === 0 ? p.inputAmount.amount.toString() : '0',
                            userData: DEFAULT_USERDATA,
                        });
                    });
                });
            }
            else {
                this.paths.map(p => {
                    // Vault expects given out swaps to be in reverse order
                    const reversedPools = [...p.pools].reverse();
                    const reversedTokens = [...p.tokens].reverse();
                    reversedPools.map((pool, i) => {
                        swaps.push({
                            poolId: pool.id,
                            assetInIndex: this.assets.indexOf(reversedTokens[i + 1].address),
                            assetOutIndex: this.assets.indexOf(reversedTokens[i].address),
                            amount: i === 0 ? p.outputAmount.amount.toString() : '0',
                            userData: DEFAULT_USERDATA,
                        });
                    });
                });
            }
        }
        else {
            const path = this.paths[0];
            const pool = path.pools[0];
            const assetIn = this.convertNativeAddressToZero(path.tokens[0].address);
            const assetOut = this.convertNativeAddressToZero(path.tokens[1].address);
            swaps = {
                poolId: pool.id,
                kind: this.swapKind,
                assetIn,
                assetOut,
                amount: path.swapAmount.amount.toString(),
                userData: DEFAULT_USERDATA,
            };
        }
        this.assets = this.assets.map(a => {
            return this.convertNativeAddressToZero(a);
        });
        this.swaps = swaps;
    }
    get inputAmount() {
        if (!this.paths.every(p => p.inputAmount.token.isEqual(this.paths[0].inputAmount.token))) {
            throw new Error('Input amount can only be calculated if all paths have the same input token');
        }
        const amounts = this.paths.map(path => path.inputAmount);
        return amounts.reduce((a, b) => a.add(b));
    }
    get outputAmount() {
        if (!this.paths.every(p => p.outputAmount.token.isEqual(this.paths[0].outputAmount.token))) {
            throw new Error('Output amount can only be calculated if all paths have the same output token');
        }
        const amounts = this.paths.map(path => path.outputAmount);
        return amounts.reduce((a, b) => a.add(b));
    }
    async query(provider, block) {
        const queries = new Contract(`0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5`, balancerQueriesAbi, provider);
        let amount;
        if (this.isBatchSwap) {
            const deltas = await queries.callStatic.queryBatchSwap(this.swapKind, this.swaps, this.assets, DEFAULT_FUND_MANAGMENT, {
                blockTag: block,
            });
            amount =
                this.swapKind === SwapKind.GivenIn
                    ? TokenAmount.fromRawAmount(this.outputAmount.token, deltas[this.assets.indexOf(this.convertNativeAddressToZero(this.outputAmount.token.address))].abs())
                    : TokenAmount.fromRawAmount(this.inputAmount.token, deltas[this.assets.indexOf(this.convertNativeAddressToZero(this.inputAmount.token.address))].abs());
        }
        else {
            const queryAmount = await queries.callStatic.querySwap(this.swaps, DEFAULT_FUND_MANAGMENT, {
                blockTag: block,
            });
            amount =
                this.swapKind === SwapKind.GivenIn
                    ? TokenAmount.fromRawAmount(this.outputAmount.token, queryAmount)
                    : TokenAmount.fromRawAmount(this.inputAmount.token, queryAmount);
        }
        return amount;
    }
    convertNativeAddressToZero(address) {
        return address === NATIVE_ASSETS[this.inputAmount.token.chainId].address
            ? ZERO_ADDRESS
            : address;
    }
    callData() {
        const iface = new Interface(balancerQueriesAbi);
        let callData;
        if (this.isBatchSwap) {
            callData = iface.encodeFunctionData('queryBatchSwap', [
                this.swapKind,
                this.swaps,
                this.assets,
                DEFAULT_FUND_MANAGMENT,
            ]);
        }
        else {
            callData = iface.encodeFunctionData('querySwap', [
                this.swaps,
                DEFAULT_FUND_MANAGMENT,
            ]);
        }
        return callData;
    }
}
//# sourceMappingURL=swap.js.map