import { Hex, Address } from 'viem';
export { Address, Hex } from 'viem';

interface BasePool {
    readonly poolType: PoolType | string;
    readonly id: Hex;
    readonly address: string;
    swapFee: bigint;
    tokens: TokenAmount[];
    getNormalizedLiquidity(tokenIn: Token, tokenOut: Token): bigint;
    swapGivenIn(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount, mutateBalances?: boolean): TokenAmount;
    swapGivenOut(tokenIn: Token, tokenOut: Token, swapAmount: TokenAmount, mutateBalances?: boolean): TokenAmount;
    getLimitAmountSwap(tokenIn: Token, tokenOut: Token, swapKind: SwapKind): bigint;
}
interface BasePoolFactory {
    isPoolForFactory(pool: RawPool): boolean;
    create(chainId: number, pool: RawPool): BasePool;
}

declare class Path {
    readonly pools: BasePool[];
    readonly tokens: Token[];
    constructor(tokens: Token[], pools: BasePool[]);
}
declare class PathWithAmount extends Path {
    readonly swapAmount: TokenAmount;
    readonly swapKind: SwapKind;
    readonly outputAmount: TokenAmount;
    readonly inputAmount: TokenAmount;
    private readonly mutateBalances;
    private readonly printPath;
    constructor(tokens: Token[], pools: BasePool[], swapAmount: TokenAmount, mutateBalances?: boolean);
    print(): void;
}

declare class Token {
    readonly chainId: number;
    readonly address: Address;
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    readonly wrapped: string;
    constructor(chainId: number, address: Address, decimals: number, symbol?: string, name?: string, wrapped?: string);
    isEqual(token: Token): boolean;
    isUnderlyingEqual(token: Token): boolean;
}

type BigintIsh = bigint | string | number;
declare class TokenAmount {
    readonly token: Token;
    readonly scalar: bigint;
    readonly decimalScale: bigint;
    amount: bigint;
    scale18: bigint;
    static fromRawAmount(token: Token, rawAmount: BigintIsh): TokenAmount;
    static fromHumanAmount(token: Token, humanAmount: `${number}`): TokenAmount;
    static fromScale18Amount(token: Token, scale18Amount: BigintIsh, divUp?: boolean): TokenAmount;
    protected constructor(token: Token, amount: BigintIsh);
    add(other: TokenAmount): TokenAmount;
    sub(other: TokenAmount): TokenAmount;
    mulUpFixed(other: bigint): TokenAmount;
    mulDownFixed(other: bigint): TokenAmount;
    divUpFixed(other: bigint): TokenAmount;
    divDownFixed(other: bigint): TokenAmount;
    toSignificant(significantDigits?: number): string;
}

declare class Swap {
    constructor({ paths, swapKind, }: {
        paths: PathWithAmount[];
        swapKind: SwapKind;
    });
    readonly chainId: number;
    readonly isBatchSwap: boolean;
    readonly paths: PathWithAmount[];
    readonly assets: Address[];
    readonly swapKind: SwapKind;
    swaps: BatchSwapStep[] | SingleSwap;
    get quote(): TokenAmount;
    get inputAmount(): TokenAmount;
    get outputAmount(): TokenAmount;
    query(rpcUrl?: string, block?: bigint): Promise<TokenAmount>;
    private convertNativeAddressToZero;
    queryCallData(): string;
}

interface PathGraphTraversalConfig {
    maxDepth: number;
    maxNonBoostedPathDepth: number;
    maxNonBoostedHopTokensInBoostedPath: number;
    approxPathsToReturn: number;
    poolIdsToInclude?: string[];
}

type SwapInputRawAmount = BigintIsh;
declare enum PoolType {
    Weighted = "Weighted",
    ComposableStable = "ComposableStable",
    MetaStable = "MetaStable",
    AaveLinear = "AaveLinear"
}
declare enum SwapKind {
    GivenIn = 0,
    GivenOut = 1
}
interface SwapOptions {
    block?: bigint;
    slippage?: bigint;
    funds?: FundManagement;
    deadline?: bigint;
    graphTraversalConfig?: Partial<PathGraphTraversalConfig>;
}
interface FundManagement {
    sender: string;
    fromInternalBalance: boolean;
    recipient: boolean;
    toInternalBalance: boolean;
}
type SorConfig = {
    chainId: number;
    rpcUrl: string;
    poolDataProviders?: PoolDataProvider | PoolDataProvider[];
    poolDataEnrichers?: PoolDataEnricher | PoolDataEnricher[];
    customPoolFactories?: BasePoolFactory[];
};
interface PoolTokenPair {
    id: string;
    pool: BasePool;
    tokenIn: Token;
    tokenOut: Token;
}
interface SingleSwap {
    poolId: Hex;
    kind: SwapKind;
    assetIn: Address;
    assetOut: Address;
    amount: bigint;
    userData: Hex;
}
interface BatchSwapStep {
    poolId: Hex;
    assetInIndex: bigint;
    assetOutIndex: bigint;
    amount: bigint;
    userData: Hex;
}
type HumanAmount = `${number}`;

type SupportedRawPoolTypes = LinearPoolType | 'Weighted' | 'Investment' | 'LiquidityBootstrapping' | 'Stable' | 'MetaStable' | 'ComposableStable' | 'StablePhantom' | 'Element';
type LinearPoolType = `${string}Linear`;
type RawPool = RawBasePool | RawLinearPool | RawWeightedPool | RawStablePool | RawComposableStablePool | RawMetaStablePool;
interface RawBasePool {
    id: Hex;
    address: Address;
    poolType: SupportedRawPoolTypes | string;
    poolTypeVersion: number;
    swapFee: HumanAmount;
    swapEnabled: boolean;
    tokens: RawPoolToken[];
    tokensList: Address[];
    liquidity: HumanAmount;
    totalShares: HumanAmount;
}
interface RawLinearPool extends RawBasePool {
    poolType: LinearPoolType;
    mainIndex: number;
    wrappedIndex: number;
    lowerTarget: HumanAmount;
    upperTarget: HumanAmount;
    tokens: RawPoolTokenWithRate[];
}
interface RawBaseStablePool extends RawBasePool {
    amp: string;
}
interface RawStablePool extends RawBaseStablePool {
    poolType: 'Stable';
}
interface RawComposableStablePool extends RawBaseStablePool {
    poolType: 'ComposableStable' | 'StablePhantom';
    tokens: RawPoolTokenWithRate[];
}
interface RawMetaStablePool extends RawBaseStablePool {
    poolType: 'MetaStable';
    tokens: RawPoolTokenWithRate[];
}
interface RawWeightedPool extends RawBasePool {
    poolType: 'Weighted' | 'Investment' | 'LiquidityBootstrapping';
    tokens: RawWeightedPoolToken[];
    hasActiveWeightUpdate?: boolean;
}
interface RawPoolToken {
    address: Address;
    index: number;
    symbol: string;
    name: string;
    decimals: number;
    balance: HumanAmount;
}
interface RawWeightedPoolToken extends RawPoolToken {
    weight: HumanAmount;
}
interface RawPoolTokenWithRate extends RawPoolToken {
    priceRate: HumanAmount;
}
interface GetPoolsResponse {
    pools: RawPool[];
    syncedToBlockNumber?: bigint;
    poolsWithActiveAmpUpdates?: string[];
    poolsWithActiveWeightUpdates?: string[];
}
interface ProviderSwapOptions {
    block?: bigint;
    timestamp: bigint;
}
interface PoolDataProvider {
    getPools(options: ProviderSwapOptions): Promise<GetPoolsResponse>;
}
interface PoolDataEnricher {
    fetchAdditionalPoolData(data: GetPoolsResponse, options: ProviderSwapOptions): Promise<AdditionalPoolData[]>;
    enrichPoolsWithData(pools: RawPool[], additionalPoolData: AdditionalPoolData[]): RawPool[];
}
interface AdditionalPoolData {
    id: string;
    [key: string]: any;
}

interface OnChainPoolData {
    id: string;
    balances: readonly bigint[];
    totalSupply: bigint;
    swapFee?: bigint;
    amp?: bigint;
    weights?: readonly bigint[];
    wrappedTokenRate?: bigint;
    scalingFactors?: readonly bigint[];
}
interface OnChainPoolDataQueryConfig {
    loadTokenBalances: 'all' | 'updates-after-block' | 'none';
    blockNumber: bigint;
    loadTotalSupply: boolean;
    loadSwapFees: boolean;
    loadLinearWrappedTokenRates: boolean;
    loadWeightsForPools: {
        poolIds?: string[];
        poolTypes?: string[];
    };
    loadAmpForPools: {
        poolIds?: string[];
        poolTypes?: string[];
    };
    loadScalingFactorForPools: {
        poolIds?: string[];
        poolTypes?: string[];
    };
}
declare class OnChainPoolDataEnricher implements PoolDataEnricher {
    private readonly rpcUrl;
    private readonly sorQueriesAddress;
    private readonly config;
    constructor(rpcUrl: string, sorQueriesAddress: Address, config?: Partial<OnChainPoolDataQueryConfig>);
    fetchAdditionalPoolData(data: GetPoolsResponse, options: SwapOptions): Promise<OnChainPoolData[]>;
    enrichPoolsWithData(pools: RawPool[], additionalPoolData: OnChainPoolData[]): RawPool[];
    private getPoolDataQueryParams;
    private getMergedFilterConfig;
    private getPoolTokenRate;
}

interface SubgraphPoolProviderConfig {
    retries: number;
    timeout: number;
    poolTypeIn?: string[];
    poolTypeNotIn?: string[];
    poolIdIn?: string[];
    poolIdNotIn?: string[];
    loadActiveWeightUpdates?: boolean;
    loadActiveAmpUpdates?: boolean;
    addFilterToPoolQuery?: boolean;
    gqlAdditionalPoolQueryFields?: string;
}
declare class SubgraphPoolProvider implements PoolDataProvider {
    private readonly url;
    private readonly config;
    constructor(chainId: number, subgraphUrl?: string, config?: Partial<SubgraphPoolProviderConfig>);
    getPools(options: ProviderSwapOptions): Promise<GetPoolsResponse>;
    private fetchDataFromSubgraph;
    private getPoolsQuery;
    private poolMatchesFilter;
}

declare const ZERO_ADDRESS: Address;
declare const NATIVE_ADDRESS: Address;
declare const MAX_UINT112 = 5192296858534827628530496329220095n;
declare const PREMINTED_STABLE_BPT = 2596148429267413814265248164610048n;
declare const DECIMAL_SCALES: {
    0: bigint;
    1: bigint;
    2: bigint;
    3: bigint;
    4: bigint;
    5: bigint;
    6: bigint;
    7: bigint;
    8: bigint;
    9: bigint;
    10: bigint;
    11: bigint;
    12: bigint;
    13: bigint;
    14: bigint;
    15: bigint;
    16: bigint;
    17: bigint;
    18: bigint;
};
declare const SECONDS_PER_YEAR = 31536000n;
declare enum ChainId {
    MAINNET = 1,
    GOERLI = 5,
    OPTIMISM = 10,
    BSC = 56,
    GNOSIS_CHAIN = 100,
    POLYGON = 137,
    ZKSYNC_TESTNET = 280,
    ZKSYNC = 324,
    ZKEVM = 1101,
    ARBITRUM_ONE = 42161,
    AVALANCHE = 43114,
    BASE_GOERLI = 84531
}
declare const SUBGRAPH_URLS: {
    1: string;
    5: string;
    10: string;
    100: string;
    137: string;
    280: string;
    324: string;
    1101: string;
    42161: string;
    43114: string;
    84531: string;
};
declare const STELLATE_URLS: {
    1: string;
    5: string;
    100: string;
    137: string;
    42161: string;
};
declare const BALANCER_QUERIES = "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5";
declare const BALANCER_SOR_QUERIES_ADDRESS = "0x1814a3b3e4362caf4eb54cd85b82d39bd7b34e41";
declare const NATIVE_ASSETS: {
    1: Token;
    5: Token;
    100: Token;
    137: Token;
    42161: Token;
};
declare const ETH: Token;
declare const DEFAULT_FUND_MANAGMENT: {
    sender: `0x${string}`;
    recipient: `0x${string}`;
    fromInternalBalance: boolean;
    toInternalBalance: boolean;
};
declare const DEFAULT_USERDATA = "0x";

declare function checkInputs(tokenIn: Token, tokenOut: Token, swapKind: SwapKind, swapAmount: BigintIsh | TokenAmount): TokenAmount;

declare const WAD = 1000000000000000000n;
declare const TWO_WAD = 2000000000000000000n;
declare const FOUR_WAD = 4000000000000000000n;
declare const abs: (n: bigint) => bigint;
declare class MathSol {
    static max(a: bigint, b: bigint): bigint;
    static min(a: bigint, b: bigint): bigint;
    static MAX_POW_RELATIVE_ERROR: bigint;
    static mulDownFixed(a: bigint, b: bigint): bigint;
    static mulUpFixed(a: bigint, b: bigint): bigint;
    static divDownFixed(a: bigint, b: bigint): bigint;
    static divUpFixed(a: bigint, b: bigint): bigint;
    static divUp(a: bigint, b: bigint): bigint;
    static powUpFixed(x: bigint, y: bigint, version?: number): bigint;
    static powDownFixed(x: bigint, y: bigint, version?: number): bigint;
    static complementFixed(x: bigint): bigint;
}

/**
 * Extracts a pool's address from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's address
 */
declare const getPoolAddress: (poolId: string) => string;
declare function poolIsLinearPool(poolType: string): boolean;
declare function poolHasVirtualSupply(poolType: string): boolean;
declare function poolHasActualSupply(poolType: string): boolean;
declare function poolHasPercentFee(poolType: string): boolean;

declare class SmartOrderRouter {
    private readonly chainId;
    private readonly router;
    private readonly poolParser;
    private readonly poolDataService;
    private pools;
    private blockNumber;
    private poolsProviderData;
    constructor({ chainId, rpcUrl, poolDataProviders, poolDataEnrichers, customPoolFactories, }: SorConfig);
    fetchAndCachePools(blockNumber?: bigint): Promise<BasePool[]>;
    fetchAndCacheLatestPoolEnrichmentData(blockNumber?: bigint): Promise<void>;
    get isInitialized(): boolean;
    getSwaps(tokenIn: Token, tokenOut: Token, swapKind: SwapKind, swapAmount: SwapInputRawAmount | TokenAmount, swapOptions?: SwapOptions): Promise<Swap | null>;
    getCandidatePaths(tokenIn: Token, tokenOut: Token, options?: Pick<SwapOptions, 'block' | 'graphTraversalConfig'>): Promise<Path[]>;
}

declare function sorParseRawPools(chainId: ChainId, pools: RawPool[], customPoolFactories?: BasePoolFactory[]): BasePool[];
declare function sorGetSwapsWithPools(tokenIn: Token, tokenOut: Token, swapKind: SwapKind, swapAmount: SwapInputRawAmount | TokenAmount, pools: BasePool[], swapOptions?: Omit<SwapOptions, 'graphTraversalConfig.poolIdsToInclude'>): Promise<Swap | null>;

export { AdditionalPoolData, BALANCER_QUERIES, BALANCER_SOR_QUERIES_ADDRESS, BasePool, BasePoolFactory, BatchSwapStep, BigintIsh, ChainId, DECIMAL_SCALES, DEFAULT_FUND_MANAGMENT, DEFAULT_USERDATA, ETH, FOUR_WAD, FundManagement, GetPoolsResponse, HumanAmount, MAX_UINT112, MathSol, NATIVE_ADDRESS, NATIVE_ASSETS, OnChainPoolDataEnricher, PREMINTED_STABLE_BPT, Path, PathWithAmount, PoolDataEnricher, PoolDataProvider, PoolTokenPair, PoolType, ProviderSwapOptions, RawBasePool, RawBaseStablePool, RawComposableStablePool, RawLinearPool, RawMetaStablePool, RawPool, RawPoolToken, RawPoolTokenWithRate, RawStablePool, RawWeightedPool, RawWeightedPoolToken, SECONDS_PER_YEAR, STELLATE_URLS, SUBGRAPH_URLS, SingleSwap, SmartOrderRouter, SorConfig, SubgraphPoolProvider, SupportedRawPoolTypes, Swap, SwapInputRawAmount, SwapKind, SwapOptions, TWO_WAD, Token, TokenAmount, WAD, ZERO_ADDRESS, abs, checkInputs, getPoolAddress, poolHasActualSupply, poolHasPercentFee, poolHasVirtualSupply, poolIsLinearPool, sorGetSwapsWithPools, sorParseRawPools };
