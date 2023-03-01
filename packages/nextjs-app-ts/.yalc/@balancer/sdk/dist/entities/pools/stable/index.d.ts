import { PoolType, SwapKind } from '../../../types';
import { BigintIsh, Token, TokenAmount } from '../../';
import { BasePool } from '../';
import { RawComposableStablePool } from '../../../data/types';
declare class StablePoolToken extends TokenAmount {
    readonly rate: bigint;
    readonly scale18: bigint;
    readonly index: number;
    constructor(token: Token, amount: BigintIsh, rate: BigintIsh, index: number);
}
declare class BPT extends TokenAmount {
    readonly rate: bigint;
    readonly virtualBalance: bigint;
    readonly index: number;
    constructor(token: Token, amount: BigintIsh, index: number);
}
export declare class StablePool implements BasePool {
    readonly id: string;
    readonly address: string;
    readonly poolType: PoolType;
    readonly amp: bigint;
    readonly swapFee: bigint;
    readonly tokens: (StablePoolToken | BPT)[];
    readonly tokensNoBpt: StablePoolToken[];
    readonly totalShares: bigint;
    readonly bptIndex: number;
    private readonly tokenMap;
    private readonly tokenIndexMap;
    private readonly tokenNoBptIndexMap;
    static fromRawPool(pool: RawComposableStablePool): StablePool;
    constructor(id: string, amp: bigint, swapFee: bigint, tokens: StablePoolToken[], totalShares: bigint);
    getNormalizedLiquidity(tokenIn: Token, tokenOut: Token): bigint;
    swapGivenIn(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount): TokenAmount;
    swapGivenOut(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount): TokenAmount;
    subtractSwapFeeAmount(amount: TokenAmount): TokenAmount;
    addSwapFeeAmount(amount: TokenAmount): TokenAmount;
    getLimitAmountSwap(tokenIn: Token, tokenOut: Token, swapKind: SwapKind): bigint;
}
export {};
