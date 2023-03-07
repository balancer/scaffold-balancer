import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { RawPoolToken } from '@balancer/sdk';
import { Button, Card, Input, Select, Space, Steps, Typography } from 'antd';
import React from 'react';

import { RawPoolExtended } from '~~/hooks/usePoolsData';
import { SwapType } from '~~/modules/batchswap/batchswap-types';

const { Text } = Typography;

interface Props {
  pathIndex: number;
  pools: RawPoolExtended[];
  tokens: RawPoolToken[];
  swapType: SwapType;
  tokenIn: string | null;
  amount: string;
  hops: {
    poolId: string | null;
    tokenOut: string | null;
  }[];
  setTokenIn: (tokenIn: string | null) => void;
  setHopPoolId: (hopIdx: number, poolId: string | null) => void;
  setHopTokenOut: (hopIdx: number, tokenOut: string | null) => void;
  setAmount: (amount: string) => void;
  addHop: () => void;
  removeLastHop: () => void;
  deletePath?: () => void;
}

export function BatchSwapPath({
  pathIndex,
  pools,
  tokens,
  swapType,
  tokenIn,
  hops,
  amount,
  setAmount,
  setHopTokenOut,
  setTokenIn,
  setHopPoolId,
  addHop,
  removeLastHop,
  deletePath,
}: Props) {
  const tokenOptions = tokens.map((token) => ({ label: `${token.symbol} - ${token.address}`, value: token.address }));
  let currentStep = hops.findIndex((hop) => !hop.poolId || !hop.tokenOut);
  currentStep = currentStep === -1 ? hops.length : currentStep;
  const decimals =
    tokens.find((token) => (swapType === 'GIVEN_IN' ? token.address === tokenIn : token.address === hops[0]?.tokenOut))
      ?.decimals || 18;

  return (
    <Card
      title={
        <Space direction="horizontal">
          <div>Path {pathIndex + 1}</div>
          {deletePath && (
            <Button icon={<DeleteOutlined />} danger type="link" onClick={deletePath} style={{ height: 24 }} />
          )}
        </Space>
      }>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Token in</Text>
        <Select
          showSearch
          allowClear
          style={{ width: '100%' }}
          placeholder="Token in"
          onChange={(value) => setTokenIn(value || null)}
          value={tokenIn}
          options={tokenOptions}
          showArrow={true}
          optionFilterProp="label"
        />
      </div>
      <Steps direction="vertical" current={currentStep}>
        {hops.map((hop, hopIdx) => {
          const hopTokenIn = hopIdx === 0 ? tokenIn : hops[hopIdx - 1].tokenOut;
          const hopPools = hopTokenIn ? pools.filter((pool) => pool.tokensList.includes(hopTokenIn)) : [];
          const selectedPool = hop.poolId ? pools.find((pool) => pool.id === hop.poolId) : undefined;
          const hopTokensOut = selectedPool ? selectedPool.tokens.filter((token) => token.address !== hopTokenIn) : [];

          return (
            <Steps.Step
              key={hopIdx}
              title={
                <Space direction="horizontal">
                  <div>Hop {hopIdx + 1}</div>
                  {hopIdx === hops.length - 1 && hops.length > 1 && (
                    <Button icon={<DeleteOutlined />} danger type="text" onClick={removeLastHop} />
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Select
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Pool"
                      onChange={(value) => setHopPoolId(hopIdx, value || null)}
                      options={hopPools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                      showArrow={true}
                      value={hop.poolId}
                      optionFilterProp="label"
                    />
                  </div>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Token out"
                    onChange={(value) => setHopTokenOut(hopIdx, value || null)}
                    value={hop.tokenOut}
                    options={hopTokensOut.map((token) => ({
                      label: `${token.symbol} - ${token.address}`,
                      value: token.address,
                    }))}
                    showArrow={true}
                    optionFilterProp="label"
                    disabled={hop.poolId === null}
                  />
                </Space>
              }
            />
          );
        })}
      </Steps>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          style={{ marginTop: 4, marginBottom: 20 }}
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={addHop}
          disabled={!tokenIn || currentStep !== hops.length}>
          Add hop
        </Button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text strong>Amount {swapType === 'GIVEN_OUT' ? 'out' : 'in'}</Text>
        <Input
          value={amount}
          onChange={(e) => {
            if (e.target.value) {
              const parts = e.target.value.split('.');
              setAmount(`${parts[0]}${parts.length > 1 ? `.${parts[1].slice(0, decimals)}` : ''}`);
            } else {
              setAmount(e.target.value);
            }
          }}
          placeholder={`Amount human readable: 1 WETH = 1.0`}
          style={{ width: '100%' }}
          type="number"
        />
      </div>
    </Card>
  );
}
