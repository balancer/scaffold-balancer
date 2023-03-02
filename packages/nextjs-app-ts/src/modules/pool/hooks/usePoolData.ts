import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery, UseQueryResult } from 'react-query';

import { useAppContracts } from '~common/components/context';
import { networkDefinitions } from '~common/constants';
import { ERC20__factory } from '~common/generated/contract-types';
import { BasePoolAbi } from '~~/modules/pool/abi/BasePoolAbi';
import { PoolToken } from '~~/modules/pool/pool-types';

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
  const vault = useAppContracts('Vault', networkDefinitions.localhost.chainId);
  const { provider } = useEthersAppContext();

  return useQuery<QueryResponse>(
    ['usePoolData', address, vault?.address],
    async () => {
      const pool = new Contract(address, BasePoolAbi, provider);

      const poolId = (await pool.getPoolId()) as string;
      const symbol = await pool.symbol();
      const name = await pool.name();
      const owner = await pool.getOwner();
      const totalSupply = (await pool.totalSupply()) as BigNumber;
      const swapFeePercentage = (await pool.getSwapFeePercentage()) as BigNumber;
      const vaultAddress = await pool.getVault();
      const poolTokensResponse = await vault.getPoolTokens(poolId);
      let inRecoveryMode = false;
      const poolTokens: PoolToken[] = [];

      try {
        // for properties not supported by all pools
        inRecoveryMode = await pool.inRecoveryMode();
      } catch {}

      for (let i = 0; i < poolTokensResponse.tokens.length; i++) {
        const tokenContract = new Contract(poolTokensResponse.tokens[i], ERC20__factory.abi, pool.provider);

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
        address,
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
    { enabled: !!vault }
  );
};
