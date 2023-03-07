"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedPoolFactory = void 0;
const _1 = require("./");
class WeightedPoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'Weighted';
    }
    create(chainId, pool) {
        return _1.WeightedPool.fromRawPool(chainId, pool);
    }
}
exports.WeightedPoolFactory = WeightedPoolFactory;
//# sourceMappingURL=factory.js.map