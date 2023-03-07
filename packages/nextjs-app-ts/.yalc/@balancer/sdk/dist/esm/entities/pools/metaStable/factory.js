import { MetaStablePool } from './';
export class MetaStablePoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'MetaStable';
    }
    create(chainId, pool) {
        return MetaStablePool.fromRawPool(chainId, pool);
    }
}
//# sourceMappingURL=factory.js.map