import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'react-query';

import { ERC20__factory } from '~common/generated/contract-types';
import { MinimalToken } from '~~/helpers/global-types';

export function useTokenBalances<T extends MinimalToken>(tokens: T[]) {
  const { provider, account } = useEthersAppContext();
  const addresses = tokens.map((token) => token.address);

  return useQuery<(T & { userBalance: string })[]>(
    ['useTokenBalances', addresses, account],
    async () => {
      return Promise.all(
        tokens.map(async (poolToken) => {
          const tokenContract = new Contract(poolToken.address, ERC20__factory.abi, provider);
          const userBalance: BigNumber = await tokenContract.balanceOf(account);

          return {
            ...poolToken,
            userBalance: formatUnits(userBalance, poolToken.decimals),
          };
        })
      );
    },
    {}
  );
}
