import { BaseContract } from 'ethers';

export interface IBalancerFunction<GContract extends BaseContract> {
  contract: GContract | undefined;
  functionName: string;
}
