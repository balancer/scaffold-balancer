"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StablePoolFactory = void 0;
const _1 = require("./");
class StablePoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'ComposableStable';
    }
    create(chainId, pool) {
        return _1.StablePool.fromRawPool(chainId, pool);
    }
}
exports.StablePoolFactory = StablePoolFactory;
//# sourceMappingURL=factory.js.map