"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaStablePoolFactory = void 0;
const _1 = require("./");
class MetaStablePoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType === 'MetaStable';
    }
    create(chainId, pool) {
        return _1.MetaStablePool.fromRawPool(chainId, pool);
    }
}
exports.MetaStablePoolFactory = MetaStablePoolFactory;
//# sourceMappingURL=factory.js.map