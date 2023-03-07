"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearPoolFactory = void 0;
const _1 = require("./");
class LinearPoolFactory {
    isPoolForFactory(pool) {
        return pool.poolType.includes('Linear');
    }
    create(chainId, pool) {
        return _1.LinearPool.fromRawPool(chainId, pool);
    }
}
exports.LinearPoolFactory = LinearPoolFactory;
//# sourceMappingURL=factory.js.map