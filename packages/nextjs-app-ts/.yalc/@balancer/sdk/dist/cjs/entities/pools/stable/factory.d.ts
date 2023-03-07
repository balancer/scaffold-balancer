import { BasePool, BasePoolFactory } from '../';
import { RawPool } from '../../../data/types';
export declare class StablePoolFactory implements BasePoolFactory {
    isPoolForFactory(pool: RawPool): boolean;
    create(chainId: number, pool: RawPool): BasePool;
}
