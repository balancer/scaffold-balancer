import { Router } from './router';
import { Swap } from './entities';
import { checkInputs } from './utils';
import { SwapKind } from './types';
import { PoolParser } from './entities/pools/parser';
import { PoolDataService } from './data/poolDataService';
export class SmartOrderRouter {
    constructor({ chainId, provider, options, poolDataProviders, rpcUrl, poolDataEnrichers = [], customPoolFactories = [], }) {
        this.pools = [];
        this.blockNumber = null;
        this.poolsProviderData = null;
        this.chainId = chainId;
        this.provider = provider;
        this.router = new Router();
        this.poolParser = new PoolParser(chainId, customPoolFactories);
        this.poolDataService = new PoolDataService(Array.isArray(poolDataProviders) ? poolDataProviders : [poolDataProviders], Array.isArray(poolDataEnrichers) ? poolDataEnrichers : [poolDataEnrichers], rpcUrl);
    }
    async fetchAndCachePools(blockNumber) {
        const { rawPools, providerData } = await this.poolDataService.fetchEnrichedPools(blockNumber);
        this.pools = this.poolParser.parseRawPools(rawPools);
        this.blockNumber = typeof blockNumber === 'number' ? blockNumber : null;
        this.poolsProviderData = providerData;
        return this.pools;
    }
    async fetchAndCacheLatestPoolEnrichmentData(blockNumber) {
        if (!this.poolsProviderData) {
            throw new Error('fetchAndCacheLatestPoolEnrichmentData can only be called after a successful call to fetchAndCachePools');
        }
        const providerOptions = {
            block: blockNumber,
            timestamp: await this.poolDataService.getTimestampForBlockNumber(blockNumber),
        };
        const enriched = await this.poolDataService.enrichPools(this.poolsProviderData, providerOptions);
        this.pools = this.poolParser.parseRawPools(enriched);
    }
    get isInitialized() {
        return this.pools.length > 0;
    }
    async getSwaps(tokenIn, tokenOut, swapKind, swapAmount, swapOptions) {
        checkInputs(tokenIn, tokenOut, swapKind, swapAmount);
        const candidatePaths = await this.getCandidatePaths(tokenIn, tokenOut, swapKind, swapOptions);
        const bestPaths = this.router.getBestPaths(candidatePaths, swapKind, swapAmount);
        const swap = new Swap({ paths: bestPaths, swapKind });
        return {
            quote: swapKind === SwapKind.GivenIn ? swap.outputAmount : swap.inputAmount,
            swap,
        };
    }
    async getCandidatePaths(tokenIn, tokenOut, swapKind, options) {
        // fetch pools if we haven't yet, or if a block number is provided that doesn't match the existing.
        if (!this.isInitialized || (options?.block && options.block !== this.blockNumber)) {
            await this.fetchAndCachePools(options?.block);
        }
        return this.router.getCandidatePaths(tokenIn, tokenOut, swapKind, this.pools, options?.graphTraversalConfig);
    }
    static parseRawPools({ chainId, pools, customPoolFactories = [], }) {
        const poolParser = new PoolParser(chainId, customPoolFactories);
        return poolParser.parseRawPools(pools);
    }
    static async getSwapsWithPools(tokenIn, tokenOut, swapKind, swapAmount, pools, swapOptions) {
        checkInputs(tokenIn, tokenOut, swapKind, swapAmount);
        const router = new Router();
        const candidatePaths = router.getCandidatePaths(tokenIn, tokenOut, swapKind, pools, swapOptions?.graphTraversalConfig);
        const bestPaths = router.getBestPaths(candidatePaths, swapKind, swapAmount);
        const swap = new Swap({ paths: bestPaths, swapKind });
        return {
            quote: swapKind === SwapKind.GivenIn ? swap.outputAmount : swap.inputAmount,
            swap,
        };
    }
}
//# sourceMappingURL=sor.js.map