"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartOrderRouter = void 0;
const router_1 = require("./router");
const entities_1 = require("./entities");
const utils_1 = require("./utils");
const types_1 = require("./types");
const parser_1 = require("./entities/pools/parser");
const poolDataService_1 = require("./data/poolDataService");
class SmartOrderRouter {
    constructor({ chainId, provider, options, poolDataProviders, rpcUrl, poolDataEnrichers = [], customPoolFactories = [], }) {
        this.pools = [];
        this.blockNumber = null;
        this.poolsProviderData = null;
        this.chainId = chainId;
        this.provider = provider;
        this.router = new router_1.Router();
        this.poolParser = new parser_1.PoolParser(chainId, customPoolFactories);
        this.poolDataService = new poolDataService_1.PoolDataService(Array.isArray(poolDataProviders) ? poolDataProviders : [poolDataProviders], Array.isArray(poolDataEnrichers) ? poolDataEnrichers : [poolDataEnrichers], rpcUrl);
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
        (0, utils_1.checkInputs)(tokenIn, tokenOut, swapKind, swapAmount);
        const candidatePaths = await this.getCandidatePaths(tokenIn, tokenOut, swapKind, swapOptions);
        const bestPaths = this.router.getBestPaths(candidatePaths, swapKind, swapAmount);
        const swap = new entities_1.Swap({ paths: bestPaths, swapKind });
        return {
            quote: swapKind === types_1.SwapKind.GivenIn ? swap.outputAmount : swap.inputAmount,
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
        const poolParser = new parser_1.PoolParser(chainId, customPoolFactories);
        return poolParser.parseRawPools(pools);
    }
    static async getSwapsWithPools(tokenIn, tokenOut, swapKind, swapAmount, pools, swapOptions) {
        (0, utils_1.checkInputs)(tokenIn, tokenOut, swapKind, swapAmount);
        const router = new router_1.Router();
        const candidatePaths = router.getCandidatePaths(tokenIn, tokenOut, swapKind, pools, swapOptions?.graphTraversalConfig);
        const bestPaths = router.getBestPaths(candidatePaths, swapKind, swapAmount);
        const swap = new entities_1.Swap({ paths: bestPaths, swapKind });
        return {
            quote: swapKind === types_1.SwapKind.GivenIn ? swap.outputAmount : swap.inputAmount,
            swap,
        };
    }
}
exports.SmartOrderRouter = SmartOrderRouter;
//# sourceMappingURL=sor.js.map