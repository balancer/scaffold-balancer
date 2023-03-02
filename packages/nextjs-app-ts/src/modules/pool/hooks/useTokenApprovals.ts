import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'react-query';

import { useAppContracts } from '~common/components/context';
import { ERC20__factory } from '~common/generated/contract-types';
import { PoolToken } from '~~/modules/pool/pool-types';

export function useTokenApprovals(poolTokens: PoolToken[]) {
  const { provider, account, chainId } = useEthersAppContext();
  const vault = useAppContracts('Vault', chainId);
  const addresses = poolTokens.map((token) => token.address);

  return useQuery(
    ['useTokenApprovals', addresses, account],
    async () => {
      return Promise.all(
        poolTokens.map(async (poolToken) => {
          const tokenContract = new Contract(poolToken.address, ERC20__factory.abi, provider);
          const allowance: BigNumber = await tokenContract.allowance(account, vault.address);

          return {
            ...poolToken,
            allowance: formatUnits(allowance, poolToken.decimals),
          };
        })
      );
    },
    {}
  );
}
