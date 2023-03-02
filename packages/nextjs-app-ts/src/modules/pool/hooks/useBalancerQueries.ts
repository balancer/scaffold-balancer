import { useEthersAppContext } from 'eth-hooks/context';
import { Contract } from 'ethers';
import { useEffect, useRef } from 'react';

import { useAppContracts } from '~common/components/context';
import { BalancerQueries__factory } from '~common/generated/external-contracts/cjs/types';

// remap the query functions to view
const queryFunctions = ['queryJoin', 'queryExit', 'querySwap', 'queryBatchSwap'];
const updatedAbi = BalancerQueries__factory.abi.map((item) => {
  if (queryFunctions.includes(item.name!)) {
    return { ...item, stateMutability: 'view' };
  }

  return item;
});

export function useBalancerQueries() {
  const { provider, chainId } = useEthersAppContext();
  const appContract = useAppContracts('BalancerQueries', chainId);
  const balancerQueries = useRef(new Contract(appContract.address, updatedAbi, provider));

  useEffect(() => {
    balancerQueries.current = new Contract(appContract.address, updatedAbi, provider);
  }, [chainId, appContract.address]);

  return balancerQueries.current;
}
