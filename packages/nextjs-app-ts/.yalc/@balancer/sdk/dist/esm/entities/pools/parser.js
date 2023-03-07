import { WeightedPoolFactory } from './weighted/factory';
import { StablePoolFactory } from './stable/factory';
import { MetaStablePoolFactory } from './metaStable/factory';
import { LinearPoolFactory } from './linear/factory';
export class PoolParser {
    constructor(chainId, customPoolFactories) {
        this.chainId = chainId;
        this.poolFactories = [
            // custom pool factories take precedence over base factories
            ...customPoolFactories,
            new WeightedPoolFactory(),
            new StablePoolFactory(),
            new MetaStablePoolFactory(),
            new LinearPoolFactory(),
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
//# sourceMappingURL=parser.js.map