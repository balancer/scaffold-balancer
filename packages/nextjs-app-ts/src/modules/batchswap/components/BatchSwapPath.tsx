import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { RawPoolToken } from '@balancer/sdk';
import { Button, Card, Col, Input, Row, Select, Space, Steps, Typography } from 'antd';
import React from 'react';

import { RawPoolExtended } from '~~/hooks/usePoolsData';

const { Text } = Typography;

interface Props {
  pathIndex: number;
  pools: RawPoolExtended[];
  tokens: RawPoolToken[];
  swapType: 'GIVEN_IN' | 'GIVEN_OUT';
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
      <Steps direction="vertical" current={currentStep}>
        {hops.map((hop, hopIdx) => (
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
                    onChange={(value) => setHopPoolId(hopIdx, value)}
                    options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                    showArrow={true}
                    value={hop.poolId}
                    optionFilterProp="label"
                  />
                </div>
                <Row gutter={8}>
                  {hopIdx === 0 && (
                    <Col span={12}>
                      <Select
                        showSearch
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Token in"
                        onChange={setTokenIn}
                        value={tokenIn}
                        options={tokenOptions}
                        showArrow={true}
                        optionFilterProp="label"
                      />
                    </Col>
                  )}
                  <Col span={hopIdx === 0 ? 12 : 24}>
                    <Select
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Token out"
                      onChange={(value) => setHopTokenOut(hopIdx, value)}
                      value={hop.tokenOut}
                      options={tokenOptions}
                      showArrow={true}
                      optionFilterProp="label"
                    />
                  </Col>
                </Row>
              </Space>
            }
          />
        ))}
      </Steps>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          style={{ marginTop: 4, marginBottom: 20 }}
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={addHop}
          disabled={currentStep !== hops.length}>
          Add hop
        </Button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text strong>Amount {swapType === 'GIVEN_OUT' ? 'out' : 'in'}</Text>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Amount ${swapType === 'GIVEN_OUT' ? 'out' : 'in'}`}
          style={{ width: '100%' }}
          type="number"
        />
      </div>
    </Card>
  );
}
