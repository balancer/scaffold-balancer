// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import { YourCustomPoolDeploy } from "./YourCustomPool.deploy.s.sol";

contract DeployContracts is Script {
    function setUp() public {}

    function run() public {
        YourCustomPoolDeploy yourCustomPoolDeploy = new YourCustomPoolDeploy();
        yourCustomPoolDeploy.setUp();
        yourCustomPoolDeploy.run();
    }
}
