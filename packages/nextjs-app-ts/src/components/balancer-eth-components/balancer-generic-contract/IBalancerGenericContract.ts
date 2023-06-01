import { TEthersAdaptor } from 'eth-hooks/models';
import { BaseContract } from 'ethers';

export interface IBalancerGenericContract<GContract extends BaseContract> {
  contractName: string;
  contract: GContract | undefined;
  mainnetAdaptor: TEthersAdaptor | undefined;
  blockExplorer: string;
}
