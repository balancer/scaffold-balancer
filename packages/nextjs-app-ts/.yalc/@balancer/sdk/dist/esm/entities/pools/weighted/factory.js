import { WeightedPool } from './';
export class WeightedPoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'Weighted';
    }
    create(chainId, pool) {
        return WeightedPool.fromRawPool(chainId, pool);
    }
}
//# sourceMappingURL=factory.js.map