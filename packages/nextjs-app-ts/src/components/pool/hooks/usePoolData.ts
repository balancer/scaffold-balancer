import { Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery, UseQueryResult } from 'react-query';

import { useAppContracts } from '~common/components/context';
import { networkDefinitions } from '~common/constants';
import { ERC20__factory } from '~common/generated/contract-types';
import { PoolToken } from '~~/components/pool/pool-types';

interface QueryResponse {
  address: string;
  poolId: string;
  symbol: string;
  name: string;
  owner: string;
  totalSupply: string;
  swapFeePercentage: string;
  inRecoveryMode: boolean;
  vaultAddress: string;
  poolTokens: PoolToken[];
}

export const usePoolData = (address: string): UseQueryResult<QueryResponse> => {
  const customPool = useAppContracts('YourCustomPool', networkDefinitions.localhost.chainId);
  const vault = useAppContracts('Vault', networkDefinitions.localhost.chainId);

  return useQuery<QueryResponse>(
    ['usePoolData', address, customPool?.address, vault?.address],
    async () => {
      const poolId = await customPool.getPoolId();
      const symbol = await customPool.symbol();
      const name = await customPool.name();
      const owner = await customPool.getOwner();
      const totalSupply = await customPool.totalSupply();
      const swapFeePercentage = await customPool.getSwapFeePercentage();
      const inRecoveryMode = await customPool.inRecoveryMode();
      const vaultAddress = await customPool.getVault();
      const poolTokensResponse = await vault.getPoolTokens(poolId);
      const poolTokens: PoolToken[] = [];

      for (let i = 0; i < poolTokensResponse.tokens.length; i++) {
        const tokenContract = new Contract(poolTokensResponse.tokens[i], ERC20__factory.abi, customPool.provider);

        const decimals: number = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();

        poolTokens.push({
          address: poolTokensResponse.tokens[i],
          symbol,
          decimals,
          balance: formatUnits(poolTokensResponse.balances[i], decimals),
        });
      }

      return {
        address: customPool.address,
        poolId,
        symbol,
        name,
        owner,
        totalSupply: formatUnits(totalSupply, 18),
        swapFeePercentage: formatUnits(swapFeePercentage, 16),
        inRecoveryMode,
        vaultAddress,
        poolTokens,
      };
    },
    { enabled: !!customPool && !!vault }
  );
};
