import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'react-query';

import { ERC20__factory } from '~common/generated/contract-types';
import { PoolToken, PoolTokenWithUserBalance } from '~~/modules/pool/pool-types';

export function useTokenBalances(poolTokens: PoolToken[]) {
  const { provider, account } = useEthersAppContext();
  const addresses = poolTokens.map((token) => token.address);

  return useQuery<PoolTokenWithUserBalance[]>(
    ['useTokenBalances', addresses, account],
    async () => {
      return Promise.all(
        poolTokens.map(async (poolToken) => {
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
