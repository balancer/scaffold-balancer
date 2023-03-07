import { LinearPool } from './';
export class LinearPoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType.includes('Linear');
    }
    create(chainId, pool) {
        return LinearPool.fromRawPool(chainId, pool);
    }
}
//# sourceMappingURL=factory.js.map