import { BasePool, OnChainPoolDataEnricher, SmartOrderRouter, SubgraphPoolProvider, Address } from '@balancer/sdk';
import { useEthersAppContext } from 'eth-hooks/context';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';

import { getNetworkInfo } from '~common/functions';

export function useSor() {
  const sor = useRef<SmartOrderRouter | null>(null);
  const { provider, chainId } = useEthersAppContext();
  const networkInfo = getNetworkInfo(chainId);
  const forkedChainId = 1; // TODO: this should be inferred based on the network forked
  const forkedNetworkInfo = getNetworkInfo(forkedChainId);

  useEffect(() => {
    if (provider && chainId && networkInfo && forkedNetworkInfo) {
      const subgraphPoolProvider = new SubgraphPoolProvider(
        forkedChainId,
        forkedNetworkInfo.balancer?.subgraphUrl || ''
      );
      // The onchain enricher is fetching from the local rpc url, so we want this to always fetch the latest.
      const onchainEnricher = new OnChainPoolDataEnricher(
        networkInfo?.rpcUrl || '',
        (forkedNetworkInfo?.balancer?.sorQueriesAddress || '') as Address,
        { loadTokenBalances: 'all' }
      );

      sor.current = new SmartOrderRouter({
        chainId: forkedChainId,
        rpcUrl: networkInfo.rpcUrl,
        poolDataProviders: subgraphPoolProvider,
        poolDataEnrichers: onchainEnricher,
      });
    }
  }, [provider, chainId, networkInfo, forkedNetworkInfo]);

  const dataQuery = useQuery<BasePool[]>(
    ['sorFetchAndCachePools', chainId, forkedChainId],
    async () => {
      if (!sor.current) {
        return [];
      }

      const pools = await sor.current?.fetchAndCachePools();

      return [];
    },
    { enabled: !!sor.current }
  );

  return {
    sor: sor.current,
    isInitialized: sor.current?.isInitialized || false,
    pools: dataQuery.data || [],
    refetchPools: dataQuery.refetch,
  };
}
