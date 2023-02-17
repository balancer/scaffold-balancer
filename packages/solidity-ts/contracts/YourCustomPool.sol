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

  function _getMaxTokens() internal pure virtual override returns (uint256) {
    return _NUM_TOKENS;
  }

  function _getTotalTokens() internal view virtual override returns (uint256) {
    return _NUM_TOKENS;
  }

  function _scalingFactor(IERC20 token) internal view virtual override returns (uint256) {
    // prettier-ignore
    if (token == _token0) {
            return _scalingFactor0;
        } else if (token == _token1) {
            return _scalingFactor1;
        } else {
            _revert(Errors.INVALID_TOKEN);
        }
  }

  function _scalingFactors() internal view virtual override returns (uint256[] memory) {
    uint256[] memory scalingFactors = new uint256[](2);

    scalingFactors[0] = _scalingFactor0;
    scalingFactors[1] = _scalingFactor1;

    return scalingFactors;
  }

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
   * Minted BPT will be sent to `recipient`, except for _getMinimumBpt(), which will be deducted from this amount and
   * sent to the zero address instead. This will cause that BPT to remain forever locked there, preventing total BTP
   * from ever dropping below that value, and ensuring `_onInitializePool` can only be called once in the entire
   * Pool's lifetime.
   *
   * The tokens granted to the Pool will be transferred from `sender`. These amounts are considered upscaled and will
   * be downscaled (rounding up) before being returned to the Vault.
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
    bptAmountIn = abi.decode(userData, (uint256));
    amountsOut = _computeProportionalAmountsOut(balances, totalSupply(), bptAmountIn);
  }

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
