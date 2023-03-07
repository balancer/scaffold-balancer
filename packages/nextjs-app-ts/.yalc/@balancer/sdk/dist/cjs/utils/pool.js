"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolHasPercentFee = exports.poolHasActualSupply = exports.poolHasVirtualSupply = exports.poolIsLinearPool = exports.getPoolAddress = void 0;
/**
 * Extracts a pool's address from its poolId
 * @param poolId - a bytes32 string of the pool's ID
 * @returns the pool's address
 */
const getPoolAddress = (poolId) => {
    if (poolId.length !== 66)
        throw new Error('Invalid poolId length');
    return poolId.slice(0, 42).toLowerCase();
};
exports.getPoolAddress = getPoolAddress;
function poolIsLinearPool(poolType) {
    return poolType.includes('Linear');
}
exports.poolIsLinearPool = poolIsLinearPool;
function poolHasVirtualSupply(poolType) {
    return poolType === 'PhantomStable' || poolIsLinearPool(poolType);
}
exports.poolHasVirtualSupply = poolHasVirtualSupply;
function poolHasActualSupply(poolType) {
    return poolType === 'ComposableStable';
}
exports.poolHasActualSupply = poolHasActualSupply;
function poolHasPercentFee(poolType) {
    return poolType === 'Element';
}
exports.poolHasPercentFee = poolHasPercentFee;
//# sourceMappingURL=pool.js.map