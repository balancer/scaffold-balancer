import { PoolType, SwapKind } from '../../../types';
import { BigintIsh, Token, TokenAmount } from '../../';
import { BasePool } from '../';
import { RawComposableStablePool } from '../../../data/types';
declare class StablePoolToken extends TokenAmount {
    readonly rate: bigint;
    readonly index: number;
    scale18: bigint;
    constructor(token: Token, amount: BigintIsh, rate: BigintIsh, index: number);
    increase(amount: bigint): TokenAmount;
    decrease(amount: bigint): TokenAmount;
}
export declare class StablePool implements BasePool {
    readonly chainId: number;
    readonly id: string;
    readonly address: string;
    readonly poolType: PoolType;
    readonly amp: bigint;
    readonly swapFee: bigint;
    readonly bptIndex: number;
    totalShares: bigint;
    tokens: StablePoolToken[];
    private readonly tokenMap;
    private readonly tokenIndexMap;
    static fromRawPool(chainId: number, pool: RawComposableStablePool): StablePool;
    constructor(id: string, amp: bigint, swapFee: bigint, tokens: StablePoolToken[], totalShares: bigint);
    getNormalizedLiquidity(tokenIn: Token, tokenOut: Token): bigint;
    swapGivenIn(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount, mutateBalances?: boolean): TokenAmount;
    swapGivenOut(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount, mutateBalances?: boolean): TokenAmount;
    subtractSwapFeeAmount(amount: TokenAmount): TokenAmount;
    addSwapFeeAmount(amount: TokenAmount): TokenAmount;
    getLimitAmountSwap(tokenIn: Token, tokenOut: Token, swapKind: SwapKind): bigint;
    skipBptIndex(index: number): number;
    dropBptItem(amounts: bigint[]): bigint[];
}
export {};
