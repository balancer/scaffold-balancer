import { BasePool, GetPoolsResponse, RawPool, SubgraphPoolProvider, sorParseRawPools } from '@balancer/sdk';
import _ from 'lodash';
import { useQuery } from 'react-query';

import { getNetworkInfo } from '~common/functions';

export type RawPoolExtended = RawPool & { name: string; symbol: string; totalLiquidity: string };

type GetPoolsResponseExtended = Omit<GetPoolsResponse, 'pools'> & {
  pools: RawPoolExtended[];
  parsedPools: BasePool[];
};

export function usePoolsData() {
  const forkedChainId = 1; // TODO: this should be inferred based on the network forked
  const forkedNetworkInfo = getNetworkInfo(forkedChainId);

  const query = useQuery<GetPoolsResponseExtended>(
    ['sorPoolData', forkedChainId],
    async () => {
      // TODO: this subgraph url is for the actual network, so we need to make sure it doesn't fetch new data not
      // TODO: present on the fork. Ideally we would be able to determine the block number at which the fork was created
      const subgraphPoolProvider = new SubgraphPoolProvider(
        forkedChainId,
        forkedNetworkInfo?.balancer?.subgraphUrl || '',
        {
          gqlAdditionalPoolQueryFields: 'name symbol totalLiquidity',
        }
      );
      const timestamp = BigInt(Math.floor(new Date().getTime() / 1000));

      const response = (await subgraphPoolProvider.getPools({ timestamp })) as GetPoolsResponseExtended;

      const orderedPools = _.orderBy(response.pools, (pool) => parseFloat(pool.totalLiquidity), 'desc');

      return {
        ...response,
        pools: orderedPools,
        // TODO: add custom factories here
        parsedPools: sorParseRawPools(forkedChainId, orderedPools, []),
      };
    },
    { enabled: !!forkedNetworkInfo && !!forkedNetworkInfo.balancer }
  );

  const pools = query.data?.pools || [];
  const parsedPools = query.data?.parsedPools || [];
  const tokens = _.uniqBy(pools.map((pool) => pool.tokens).flat(), 'address');
  const poolTypes = _.uniq(pools.map((pool) => pool.poolType));

  return {
    ...query,
    pools,
    tokens,
    poolTypes,
    parsedPools,
  };
}
