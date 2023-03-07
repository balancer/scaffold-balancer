"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolParser = void 0;
const factory_1 = require("./weighted/factory");
const factory_2 = require("./stable/factory");
const factory_3 = require("./metaStable/factory");
const factory_4 = require("./linear/factory");
class PoolParser {
    constructor(chainId, customPoolFactories) {
        this.chainId = chainId;
        this.poolFactories = [
            // custom pool factories take precedence over base factories
            ...customPoolFactories,
            new factory_1.WeightedPoolFactory(),
            new factory_2.StablePoolFactory(),
            new factory_3.MetaStablePoolFactory(),
            new factory_4.LinearPoolFactory(),
        ];
    }
    parseRawPools(rawPools) {
        const pools = [];
        for (const rawPool of rawPools) {
            for (const factory of this.poolFactories) {
                if (factory.isPoolForFactory(rawPool)) {
                    pools.push(factory.create(this.chainId, rawPool));
                    break;
                }
            }
        }
        return pools;
    }
}
exports.PoolParser = PoolParser;
//# sourceMappingURL=parser.js.map