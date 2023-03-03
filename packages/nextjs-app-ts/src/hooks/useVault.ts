import { ZERO_ADDRESS } from '@balancer/sdk';
import { useEthersAppContext } from 'eth-hooks/context';
import { Contract } from 'ethers';
import { useEffect, useRef } from 'react';

import { useAppContracts } from '~common/components/context';
import { Vault__factory } from '~common/generated/external-contracts/cjs/types';

// remap the query functions to view
const queryFunctions = ['queryBatchSwap'];
const updatedAbi = Vault__factory.abi.map((item) => {
  if (queryFunctions.includes(item.name!)) {
    return { ...item, stateMutability: 'view' };
  }

  return item;
});

export function useVault() {
  const { provider, chainId } = useEthersAppContext();
  const appContract = useAppContracts('Vault', chainId);
  const vault = useRef(new Contract(appContract?.address || ZERO_ADDRESS, updatedAbi, provider));

  useEffect(() => {
    vault.current = new Contract(appContract?.address || ZERO_ADDRESS, updatedAbi, provider);
  }, [chainId, appContract?.address]);

  return vault.current;
}
