import { StablePool } from './';
export class StablePoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'ComposableStable';
    }
    create(chainId, pool) {
        return StablePool.fromRawPool(chainId, pool);
    }
}
//# sourceMappingURL=factory.js.map