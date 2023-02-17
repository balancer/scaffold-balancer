import { NetworkID } from '@dethcrypto/eth-sdk/dist/abi-management/networks';
import { TExternalContractsAddressMap } from 'eth-hooks/models';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * #### Instructions
 * - Add your contracts to the list here
 * - The format is described by {@link TExternalContractsAddressMap}
 *
 * ### Summary
 * The list of external contracts use by the app.
 * it is used to generate the type definitions for the external contracts by `yarn contracts:build`
 * provide the name and address of the external contract and the definition will be generated
 */
export const externalContractsAddressMap: TExternalContractsAddressMap = {
  [NetworkID.MAINNET]: {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    Vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    BalancerQueries: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
  },
  31337: {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    Vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    BalancerQueries: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
  },
  // [NetworkID.POLYGON]: {
  //   DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  // },
};
