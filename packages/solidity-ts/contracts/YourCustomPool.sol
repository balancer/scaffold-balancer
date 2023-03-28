// SPDX-License-Identifier: GPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@balancer-labs/v2-pool-utils/contracts/BaseMinimalSwapInfoPool.sol";

/**
 * A minimal custom Balancer pool implementing BaseMinimalSwapInfoPool.
 *
 * There are three specialization settings for Pools, to allow for cheaper swaps at the cost of reduced functionality.
 * For a break down on each specialization:
 * https://github.com/balancer/balancer-v2-monorepo/blob/master/pkg/interfaces/contracts/vault/IVault.sol#L198-L215
 *
 * By implementing BaseMinimalSwapInfoPool, we signal that we are implementing either the MinimalSwapInfo or TwoToken specialization:
 * https://github.com/balancer/balancer-v2-monorepo/blob/master/pkg/interfaces/contracts/vault/IMinimalSwapInfoPool.sol#L4
 *
 * If we wanted to implement the General specialization (ie: no optimizations), we would likely implement BaseGeneralPool
 * instead of BaseMinimalSwapInfoPool.
 * https://github.com/balancer/balancer-v2-monorepo/blob/master/pkg/pool-utils/contracts/BaseGeneralPool.sol
 *
 * Defining your pricing function within the scope of balancer involves the implementation of two functions,
 * _onSwapGivenIn and _onSwapGivenOut. Both functions have been implemented minimally in this contract, with full
 * descriptions of each function available in the comments above the implementation.
 *
 * You can reference how _onSwapGivenIn and _onSwapGivenOut have been implemented for the WeightedPool,
 * ComposableStablePool and LinearPool below:
 * https://github.com/balancer-labs/balancer-v2-monorepo/blob/master/pkg/pool-weighted/contracts/BaseWeightedPool.sol#L107-L135
 * https://github.com/balancer-labs/balancer-v2-monorepo/blob/master/pkg/pool-stable/contracts/ComposableStablePool.sol#L237-L277
 * https://github.com/balancer-labs/balancer-v2-monorepo/blob/master/pkg/pool-linear/contracts/LinearPool.sol#L319-L333
 *
 * For joining and exiting, there are four functions that need to be implemented: _onInitializePool, _onJoinPool,
 * _onExitPool, and _doRecoveryModeExit. To allow for flexibility in how your custom pool manages joins and exits,
 * balancer pools support a field called userData that can contain arbitrary abi encoded data specific to your pool implementation.
 * The unofficial standard is that the first field in the userData is a unit8 representing some enum value. Refer to the
 * user data implementations for weighted and stable pools:
 * https://github.com/balancer/balancer-v2-monorepo/blob/master/pkg/interfaces/contracts/pool-weighted/WeightedPoolUserData.sol
 * https://github.com/balancer/balancer-v2-monorepo/blob/master/pkg/interfaces/contracts/pool-stable/StablePoolUserData.sol
 *
 * _doRecoveryModeExit should implement a minimal proportional exit as it is only callable when a pool is in recovery mode.
 * No complex code or external calls should be made _doRecoveryModeExit.
 *
 * Outside of the expectation of a uint8 as the first value, the userData is fully customizable for your specific use case.
 * userData is also supported on both _onSwapGivenIn and _onSwapGivenOut, allowing you to require additional metadata when
 * implementing your swap functionality.
 */
contract YourCustomPool is BaseMinimalSwapInfoPool {
    using FixedPoint for uint256;

    uint256 private constant _ONE = 1e18;
    uint256 private constant _FIFTY_PERCENT = 0.5e18;
    uint256 internal constant _MAX_IN_RATIO = 0.3e18;
    uint256 internal constant _MAX_OUT_RATIO = 0.3e18;
    uint256 internal constant _NUM_TOKENS = 2;

    IERC20 internal immutable _token0;
    IERC20 internal immutable _token1;

    uint256 internal immutable _scalingFactor0;
    uint256 internal immutable _scalingFactor1;

    constructor(
        IVault vault,
        string memory name,
        string memory symbol,
        IERC20[] memory tokens,
        uint256 swapFeePercentage,
        address owner
    )
        BasePool(
            vault,
            IVault.PoolSpecialization.TWO_TOKEN,
            name,
            symbol,
            tokens,
            new address[](2), //assetManagers
            swapFeePercentage,
            0, //pauseWindowDuration
            0, //bufferPeriodDuration
            owner
        )
    {
        _token0 = tokens[0];
        _token1 = tokens[1];

        _scalingFactor0 = _computeScalingFactor(tokens[0]);
        _scalingFactor1 = _computeScalingFactor(tokens[1]);
    }

    /**
     * @dev Returns the maximum possible number of tokens this pool could have.
     */
    function _getMaxTokens() internal pure virtual override returns (uint256) {
        return _NUM_TOKENS;
    }

    /**
     * @dev Returns the number of tokens in this pool.
     */
    function _getTotalTokens() internal view virtual override returns (uint256) {
        return _NUM_TOKENS;
    }

    /**
     * @dev Returns the scaling factor for one of the Pool's tokens. Should revert with Errors.INVALID_TOKEN if `token`
     * is not a token registered by the Pool.
     *
     * All scaling factors are fixed-point values with 18 decimals, to allow for this function to be overridden by
     * derived contracts that need to apply further scaling, making these factors potentially non-integer.
     *
     * The largest 'base' scaling factor (i.e. in tokens with less than 18 decimals) is 10**18, which in fixed-point is
     * 10**36. This value can be multiplied with a 112 bit Vault balance with no overflow by a factor of ~1e7, making
     * even relatively 'large' factors safe to use.
     *
     * The 1e7 figure is the result of 2**256 / (1e18 * 1e18 * 2**112).
     */
    function _scalingFactor(IERC20 token) internal view virtual override returns (uint256) {
        if (token == _token0) {
            return _scalingFactor0;
        } else if (token == _token1) {
            return _scalingFactor1;
        } else {
            _revert(Errors.INVALID_TOKEN);
        }
    }

    /**
     * @dev Same as `_scalingFactor()`, except for all registered tokens (in the same order as registered). The Vault
     * will always pass balances in this order when calling any of the Pool hooks.
     */
    function _scalingFactors() internal view virtual override returns (uint256[] memory) {
        uint256[] memory scalingFactors = new uint256[](_NUM_TOKENS);

        scalingFactors[0] = _scalingFactor0;
        scalingFactors[1] = _scalingFactor1;

        return scalingFactors;
    }

    /*
     * @dev Called when a swap with the Pool occurs, where the amount of tokens entering the Pool is known.
     *
     * Returns the amount of tokens that will be taken from the Pool in return.
     *
     * All amounts inside `swapRequest`, `balanceTokenIn`, and `balanceTokenOut` are upscaled. The swap fee has already
     * been deducted from `swapRequest.amount`.
     *
     * The return value is also considered upscaled, and will be downscaled (rounding down) before returning it to the
     * Vault.
     */
    function _onSwapGivenIn(
        SwapRequest memory swapRequest,
        uint256 currentBalanceTokenIn,
        uint256 currentBalanceTokenOut
    ) internal virtual override returns (uint256) {
        _require(swapRequest.amount <= currentBalanceTokenIn.mulDown(_MAX_IN_RATIO), Errors.MAX_IN_RATIO);

        uint256 denominator = currentBalanceTokenIn.add(swapRequest.amount);
        uint256 base = currentBalanceTokenIn.divUp(denominator);

        return currentBalanceTokenOut.mulDown(base.complement());
    }

    /*
     * @dev Called when a swap with the Pool occurs, where the amount of tokens exiting the Pool is known.
     *
     * Returns the amount of tokens that will be granted to the Pool in return.
     *
     * All amounts inside `swapRequest`, `balanceTokenIn`, and `balanceTokenOut` are upscaled.
     *
     * The return value is also considered upscaled, and will be downscaled (rounding up) before applying the swap fee
     * and returning it to the Vault.
     */
    function _onSwapGivenOut(
        SwapRequest memory swapRequest,
        uint256 currentBalanceTokenIn,
        uint256 currentBalanceTokenOut
    ) internal virtual override returns (uint256) {
        _require(swapRequest.amount <= currentBalanceTokenOut.mulDown(_MAX_OUT_RATIO), Errors.MAX_OUT_RATIO);

        uint256 base = currentBalanceTokenOut.divUp(currentBalanceTokenOut.sub(swapRequest.amount));

        // Because the base is larger than one (and the power rounds up), the power should always be larger than one, so
        // the following subtraction should never revert.
        uint256 ratio = base.sub(_ONE);

        return currentBalanceTokenIn.mulUp(ratio);
    }

    /**
     * @dev Called when the Pool is joined for the first time; that is, when the BPT total supply is zero.
     *
     * Returns the amount of BPT to mint, and the token amounts the Pool will receive in return.
     *
     * All minted BPT will be sent to `recipient`, except for _getMinimumBpt(), which will be deducted from this amount
     * and sent to the zero address instead. This will cause that BPT to remain forever locked there, preventing total
     * BTP from ever dropping below that value, and ensuring `_onInitializePool` can only be called once in the entire
     * Pool's lifetime. The default value of _getMinimumBpt() ie 1e6
     *
     * The tokens granted to the Pool (amountsIn) will be transferred from `sender`. These amounts must be upscaled
     * and will be downscaled (rounding up) before being returned to the Vault.
     */
    function _onInitializePool(
        bytes32,
        address,
        address,
        uint256[] memory scalingFactors,
        bytes memory userData
    ) internal virtual override returns (uint256, uint256[] memory) {
        uint256[] memory amountsIn = abi.decode(userData, (uint256[]));

        _ensureInputLengthMatch(amountsIn.length, scalingFactors.length);
        _upscaleArray(amountsIn, scalingFactors);

        uint256 invariantAfterJoin = _ONE.mulDown(amountsIn[0].powDown(_FIFTY_PERCENT));
        invariantAfterJoin = invariantAfterJoin.mulDown(amountsIn[1].powDown(_FIFTY_PERCENT));

        // Set the initial BPT to the value of the invariant times the number of tokens. This makes BPT supply more
        // consistent in Pools with similar compositions but different number of tokens.
        uint256 bptAmountOut = Math.mul(invariantAfterJoin, amountsIn.length);

        return (bptAmountOut, amountsIn);
    }

    /**
     * @dev Called whenever the Pool is joined after the first initialization join (see `_onInitializePool`).
     *
     * Returns the amount of BPT to mint, the token amounts that the Pool will receive in return, and the number of
     * tokens to pay in protocol swap fees.
     *
     * Implementations of this function might choose to mutate the `balances` array to save gas (e.g. when
     * performing intermediate calculations, such as subtraction of due protocol fees). This can be done safely.
     *
     * Minted BPT will be sent to `recipient`.
     *
     * The tokens granted to the Pool will be transferred from `sender`. These amounts are considered upscaled and will
     * be downscaled (rounding up) before being returned to the Vault.
     *
     * Due protocol swap fees will be taken from the Pool's balance in the Vault (see `IBasePool.onJoinPool`). These
     * amounts are considered upscaled and will be downscaled (rounding down) before being returned to the Vault.
     */
    function _onJoinPool(
        bytes32,
        address,
        address,
        uint256[] memory balances,
        uint256,
        uint256,
        uint256[] memory,
        bytes memory userData
    ) internal virtual override returns (uint256, uint256[] memory) {
        uint256 bptAmountOut = abi.decode(userData, (uint256));

        // Note that there is no maximum amountsIn parameter: this is handled by `IVault.joinPool`.
        uint256[] memory amountsIn = _computeProportionalAmountsIn(balances, totalSupply(), bptAmountOut);

        return (bptAmountOut, amountsIn);
    }

    /**
     * @dev Called whenever the Pool is exited.
     *
     * Returns the amount of BPT to burn, the token amounts for each Pool token that the Pool will grant in return, and
     * the number of tokens to pay in protocol swap fees.
     *
     * Implementations of this function might choose to mutate the `balances` array to save gas (e.g. when
     * performing intermediate calculations, such as subtraction of due protocol fees). This can be done safely.
     *
     * BPT will be burnt from `sender`.
     *
     * The Pool will grant tokens to `recipient`. These amounts are considered upscaled and will be downscaled
     * (rounding down) before being returned to the Vault.
     *
     * Due protocol swap fees will be taken from the Pool's balance in the Vault (see `IBasePool.onExitPool`). These
     * amounts are considered upscaled and will be downscaled (rounding down) before being returned to the Vault.
     */
    function _onExitPool(
        bytes32,
        address,
        address,
        uint256[] memory balances,
        uint256,
        uint256,
        uint256[] memory,
        bytes memory userData
    ) internal virtual override returns (uint256 bptAmountIn, uint256[] memory amountsOut) {
        (, bptAmountIn) = abi.decode(userData, (uint8, uint256));
        amountsOut = _computeProportionalAmountsOut(balances, totalSupply(), bptAmountIn);
    }

    /**
     * @dev A minimal proportional exit, suitable as is for most pools: though not for pools with preminted BPT
     * or other special considerations. Designed to be overridden if a pool needs to do extra processing,
     * such as scaling a stored invariant, or caching the new total supply.
     *
     * No complex code or external calls should be made in derived contracts that override this!
     */
    function _doRecoveryModeExit(
        uint256[] memory balances,
        uint256 totalSupply,
        bytes memory userData
    ) internal pure override returns (uint256 bptAmountIn, uint256[] memory amountsOut) {
        (, bptAmountIn) = abi.decode(userData, (uint8, uint256));
        amountsOut = _computeProportionalAmountsOut(balances, totalSupply, bptAmountIn);
    }

    function _computeProportionalAmountsIn(
        uint256[] memory balances,
        uint256 bptTotalSupply,
        uint256 bptAmountOut
    ) internal pure returns (uint256[] memory amountsIn) {
        /************************************************************************************
        // computeProportionalAmountsIn                                                    //
        // (per token)                                                                     //
        // aI = amountIn                   /      bptOut      \                            //
        // b = balance           aI = b * | ----------------- |                            //
        // bptOut = bptAmountOut           \  bptTotalSupply  /                            //
        // bpt = bptTotalSupply                                                            //
        ************************************************************************************/

        // Since we're computing amounts in, we round up overall. This means rounding up on both the
        // multiplication and division.

        uint256 bptRatio = bptAmountOut.divUp(bptTotalSupply);

        amountsIn = new uint256[](balances.length);
        for (uint256 i = 0; i < balances.length; i++) {
            amountsIn[i] = balances[i].mulUp(bptRatio);
        }
    }

    function _computeProportionalAmountsOut(
        uint256[] memory balances,
        uint256 bptTotalSupply,
        uint256 bptAmountIn
    ) internal pure returns (uint256[] memory amountsOut) {
        /**********************************************************************************************
        // computeProportionalAmountsOut                                                             //
        // (per token)                                                                               //
        // aO = tokenAmountOut             /        bptIn         \                                  //
        // b = tokenBalance      a0 = b * | ---------------------  |                                 //
        // bptIn = bptAmountIn             \     bptTotalSupply    /                                 //
        // bpt = bptTotalSupply                                                                      //
        **********************************************************************************************/

        // Since we're computing an amount out, we round down overall. This means rounding down on both the
        // multiplication and division.

        uint256 bptRatio = bptAmountIn.divDown(bptTotalSupply);

        amountsOut = new uint256[](balances.length);
        for (uint256 i = 0; i < balances.length; i++) {
            amountsOut[i] = balances[i].mulDown(bptRatio);
        }
    }

    function _ensureInputLengthMatch(uint256 a, uint256 b) internal pure {
        _require(a == b, Errors.INPUT_LENGTH_MISMATCH);
    }
}
