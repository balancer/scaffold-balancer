import { RawPoolToken, SwapInfo, TokenAmount } from '@balancer/sdk';
import { Button, Space, Tag, Tooltip, Typography } from 'antd';
import { useEthersAppContext } from 'eth-hooks/context';
import { formatUnits } from 'ethers/lib/utils';
import React, { useState } from 'react';

import { getNetworkInfo } from '~common/functions';
import { getToken } from '~~/helpers/tokens';
import { SwapType } from '~~/modules/batchswap/batchswap-types';

interface Props {
  tokens: RawPoolToken[];
  swapInfo: SwapInfo;
  tokenIn: RawPoolToken;
  tokenOut: RawPoolToken;
  swapType: SwapType;
}

export function SorSwapQueryResults({ tokens, swapInfo, swapType, tokenIn, tokenOut }: Props) {
  const { chainId, provider } = useEthersAppContext();
  const networkInfo = getNetworkInfo(chainId);
  const swapToken = swapType === 'GIVEN_OUT' ? tokenIn : tokenOut;
  const isGivenIn = swapType === 'GIVEN_IN';
  const [isQuerying, setIsQuerying] = useState(false);
  const [onChainAmount, setOnChainAmount] = useState<TokenAmount | null>(null);

  async function queryOnChain() {
    if (provider) {
      setIsQuerying(true);
      const response = await swapInfo.swap.query(provider);
      setOnChainAmount(response);
      setIsQuerying(false);
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <div>
          <div>
            {swapToken.symbol} {isGivenIn ? 'out' : 'in'}:{' '}
            {formatUnits(swapInfo.quote.amount.toString(), swapToken.decimals)}
          </div>
          <div>
            {swapToken.symbol} {isGivenIn ? 'out' : 'in'} scaled: {swapInfo.quote.amount.toString()}
          </div>
          <div>Is batch swap: {swapInfo.swap.isBatchSwap ? 'true' : 'false'}</div>
        </div>
        <div>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
            Paths
          </Typography.Text>
          {swapInfo.swap.paths.map((path, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              {path.tokens.map((token, index) => (
                <>
                  <Tooltip
                    title={
                      <div>
                        <Typography.Link href={`${networkInfo?.blockExplorer}token/${token.address}`} target="_blank">
                          {token.address}
                        </Typography.Link>
                        <div>decimals: {token.decimals}</div>
                      </div>
                    }>
                    <Tag style={{ marginRight: 0 }}>
                      {index === 0 ? `${path.inputAmount.toSignificant()} ` : null}
                      {index === path.tokens.length - 1 ? `${path.outputAmount.toSignificant()} ` : null}
                      {getToken(token.address, tokens)?.symbol}
                    </Tag>
                  </Tooltip>
                  {index < path.pools.length ? (
                    <>
                      <div style={{ height: 2, flex: 1, backgroundColor: 'lightGray' }} />
                      <Tooltip
                        title={
                          <div>
                            <Typography.Link
                              href={`${networkInfo?.blockExplorer}token/${path.pools[index].address}`}
                              target="_blank">
                              {path.pools[index].address}
                            </Typography.Link>
                            <div>{path.pools[index].id}</div>
                          </div>
                        }>
                        <div
                          style={{
                            backgroundColor: '#1677ff',
                            width: 14,
                            height: 14,
                            borderRadius: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <div style={{ backgroundColor: 'white', width: 6, height: 6, borderRadius: 100 }} />
                        </div>
                      </Tooltip>
                      <div style={{ height: 2, flex: 1, backgroundColor: 'lightGray' }} />
                    </>
                  ) : null}
                </>
              ))}
            </div>
          ))}
        </div>
      </Space>
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <Button type="primary" onClick={queryOnChain} loading={isQuerying}>
          Query on chain
        </Button>
      </div>
      {onChainAmount && !isQuerying && (
        <>
          <div>
            {swapToken.symbol} {isGivenIn ? 'out' : 'in'}:{' '}
            {formatUnits(onChainAmount.amount.toString(), swapToken.decimals)}
          </div>
          <div>
            {swapToken.symbol} {isGivenIn ? 'out' : 'in'} scaled: {onChainAmount.amount.toString()}
          </div>
        </>
      )}
    </div>
  );
}
