// deploy/00_deploy_your_contract.js
import { ContractReceipt } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import * as expectEvent from '../../helpers/functions/expectEvent';

const vaultAddressMainnet = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const managedPoolAddressMainnet = '0x9Ac3E70dB606659Bf32D4BdFbb687AD193FD1F5B';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('NullControllerFactory', {
    from: deployer,
    args: [vaultAddressMainnet, managedPoolAddressMainnet],
    log: true,
  });

  // Deploy a pool to have a valid value for factory's getLastCreatedPoolId
  const NullControllerFactoryContract = await ethers.getContract('NullControllerFactory', deployer);
  const receipt = (await (
    await NullControllerFactoryContract.create([
      'ABC',
      'ABC',
      ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      ['500000000000000000', '500000000000000000'],
      '10000000000000000',
      true,
      '10000000000000000',
      0,
    ])
  ).wait()) as unknown as ContractReceipt;
  const event = expectEvent.inReceipt(receipt, 'ControllerCreated');
  const poolId = event.args.poolId;

  // Deploy Null Controller so that abi is exported to hardhat_contracts.json (common folder)
  await deploy('NullController', {
    from: deployer,
    args: [vaultAddressMainnet, poolId],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */
};
export default func;
func.tags = ['NullControllerFactory', 'NullController'];
