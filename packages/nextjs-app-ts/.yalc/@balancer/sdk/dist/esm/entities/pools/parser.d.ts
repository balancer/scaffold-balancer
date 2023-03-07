import { BasePool, BasePoolFactory } from './';
import { RawPool } from '../../data/types';
export declare class PoolParser {
    private readonly poolFactories;
    private readonly chainId;
    constructor(chainId: number, customPoolFactories: BasePoolFactory[]);
    parseRawPools(rawPools: RawPool[]): BasePool[];
}
