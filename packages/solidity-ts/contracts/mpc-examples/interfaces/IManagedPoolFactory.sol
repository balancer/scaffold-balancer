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

import "@balancer-labs/v2-interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol";

interface IManagedPoolFactory {
    struct ManagedPoolParams {
        string name;
        string symbol;
        address[] assetManagers;
    }

    struct ManagedPoolSettingsParams {
        IERC20[] tokens;
        uint256[] normalizedWeights;
        uint256 swapFeePercentage;
        bool swapEnabledOnStart;
        bool mustAllowlistLPs;
        uint256 managementAumFeePercentage;
        uint256 aumFeeId;
    }

    /**
     * @dev Deploys a new `ManagedPool`. The owner should be a contract, deployed by another factory.
     */
    function create(
        ManagedPoolParams memory poolParams,
        ManagedPoolSettingsParams memory settingsParams,
        address owner,
        bytes32 salt
    ) external returns (address pool);

    /**
     * @dev Return the address of the most recently created pool.
     */
    function getLastCreatedPool() external view returns (address);

    /**
     * @dev Check whether the derived factory has been disabled.
     */
    function isDisabled() external view returns (bool);
}
