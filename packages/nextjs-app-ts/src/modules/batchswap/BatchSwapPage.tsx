import { Button, Divider, Select, Typography } from 'antd';
import React, { useState } from 'react';

import { IScaffoldAppProviders } from '~common/models';
import { usePoolsData } from '~~/hooks/usePoolsData';
import { BatchSwapPathData, SwapType } from '~~/modules/batchswap/batchswap-types';
import { BatchSwapData } from '~~/modules/batchswap/components/BatchSwapData';
import { BatchSwapPath } from '~~/modules/batchswap/components/BatchSwapPath';

const { Title, Paragraph, Text } = Typography;

interface Props {
  scaffoldAppProviders: IScaffoldAppProviders;
}

export function BatchSwapPage({ scaffoldAppProviders }: Props) {
  const { pools, tokens } = usePoolsData();
  const [swapType, setSwapType] = useState<SwapType>('GIVEN_IN');
  const [paths, setPaths] = useState<BatchSwapPathData[]>([{ tokenIn: null, hops: [], amount: '' }]);

  return (
    <div style={{ marginTop: 24, marginLeft: 18, marginRight: 18, paddingBottom: 200 }}>
      <Typography>
        <Title level={2}>Batch Swap</Title>
        <Paragraph>
          Balancer protocol supports powerful multi-hop trades, also known as &quot;batch swaps.&quot; A single batch
          swap can contain several multi-hop trades, all executed within a single transaction. This tool allows you to
          construct arbitrarily complex batch swaps. You can then query and execute the batch swap against the vault.
        </Paragraph>
        <Divider />
        <Title level={4} style={{ marginBottom: 24 }}>
          Construct a batch swap
        </Title>
        <div style={{ marginBottom: 24 }}>
          <Text strong>Select the swap type</Text>
          <Paragraph>
            A batch swap can consist of many paths, but the selected swap type applies to all paths within the batch
            swap. <Text strong>Given in</Text> allows you to define the exact amount of tokenIn that you will pay.{' '}
            <Text strong>Given out</Text> allows you to define the exact amount of tokenOut you will receive.
          </Paragraph>
          <Select
            style={{ width: '100%' }}
            defaultValue="GIVEN_IN"
            placeholder="Swap type"
            value={swapType}
            onChange={setSwapType}>
            <Select.Option value="GIVEN_IN">Given in</Select.Option>
            <Select.Option value="GIVEN_OUT">Given out</Select.Option>
          </Select>
        </div>
        <Text strong>Build your swap paths</Text>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque gravida porta faucibus. Nulla imperdiet nulla
          felis, in commodo nulla fringilla eget.
        </Paragraph>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {paths.map((path, pathIdx) => (
            <div key={pathIdx} style={{ width: '33.33%', paddingRight: 8, paddingBottom: 16 }}>
              <BatchSwapPath
                pathIndex={pathIdx}
                pools={pools}
                tokens={tokens}
                swapType={swapType || 'GIVEN_IN'}
                tokenIn={path.tokenIn}
                amount={path.amount}
                hops={path.hops}
                setTokenIn={(tokenIn) => {
                  if (!paths[pathIdx].tokenIn && tokenIn && paths[pathIdx].hops.length === 0) {
                    paths[pathIdx].hops.push({ poolId: null, tokenOut: null });
                  } else if (!tokenIn && paths[pathIdx].hops.length > 0) {
                    paths[pathIdx].hops = [];
                  } else if (tokenIn !== paths[pathIdx].tokenIn && paths[pathIdx].hops.length > 0) {
                    paths[pathIdx].hops = [{ poolId: null, tokenOut: null }];
                  }

                  paths[pathIdx].tokenIn = tokenIn;
                  setPaths([...paths]);
                }}
                setHopPoolId={(hopIdx, poolId) => {
                  if (poolId === null || paths[pathIdx].hops[hopIdx].poolId !== poolId) {
                    paths[pathIdx].hops[hopIdx].tokenOut = null;
                    paths[pathIdx].hops = paths[pathIdx].hops.slice(0, hopIdx + 1);
                  }

                  paths[pathIdx].hops[hopIdx].poolId = poolId;
                  setPaths([...paths]);
                }}
                setHopTokenOut={(hopIdx, tokenOut) => {
                  if (tokenOut === null) {
                    paths[pathIdx].hops = paths[pathIdx].hops.slice(0, hopIdx + 1);
                  } else if (
                    paths[pathIdx].hops[hopIdx].tokenOut !== null &&
                    paths[pathIdx].hops[hopIdx].tokenOut !== tokenOut &&
                    hopIdx < paths[pathIdx].hops.length - 1
                  ) {
                    paths[pathIdx].hops = [
                      ...paths[pathIdx].hops.slice(0, hopIdx + 1),
                      { poolId: null, tokenOut: null },
                    ];
                  }

                  paths[pathIdx].hops[hopIdx].tokenOut = tokenOut;
                  setPaths([...paths]);
                }}
                setAmount={(amount) => {
                  paths[pathIdx].amount = amount;
                  setPaths([...paths]);
                }}
                addHop={() => {
                  paths[pathIdx].hops.push({ poolId: null, tokenOut: null });
                  setPaths([...paths]);
                }}
                removeLastHop={() => {
                  paths[pathIdx].hops = paths[pathIdx].hops.slice(0, paths[pathIdx].hops.length - 1);
                  setPaths([...paths]);
                }}
                deletePath={
                  paths.length > 1 && pathIdx === paths.length - 1
                    ? () => {
                        setPaths(paths.slice(0, paths.length - 1));
                      }
                    : undefined
                }
              />
            </div>
          ))}

          <div style={{ width: '33.33%', paddingRight: 8, paddingBottom: 8 }}>
            <Button
              type="primary"
              onClick={() => {
                setPaths([...paths, { hops: [], amount: '', tokenIn: null }]);
              }}>
              Add path
            </Button>
          </div>
        </div>
      </Typography>
      <BatchSwapData
        swapType={swapType || 'GIVEN_IN'}
        paths={paths}
        tokens={tokens}
        scaffoldAppProviders={scaffoldAppProviders}
      />
    </div>
  );
}
