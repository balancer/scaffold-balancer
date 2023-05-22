import { BaseContract } from 'ethers';

import { IBalancerGenericContract } from './IBalancerGenericContract';

export const useBalancerGenericContract = ({ contract, contractName }: IBalancerGenericContract<BaseContract>) => {
  const contractAddress = contract?.address;

  return {
    contract,
    contractAddress,
    contractName,
  };
};
