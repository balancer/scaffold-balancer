import { SettingOutlined } from '@ant-design/icons';
import { SmartOrderRouter, SwapKind, Token, TokenAmount } from '@balancer/sdk';
import { Button, Card, Col, Divider, Empty, Input, Row, Select, Space, Typography } from 'antd';
import React, { useState } from 'react';

import { TokenApprovals } from '~~/components/TokenApprovals';
import { TokenSnatch } from '~~/components/TokenSnatch';
import { usePoolsData } from '~~/hooks/usePoolsData';
import { useTokenApprovals } from '~~/hooks/useTokenApprovals';
import { SorConfigModal } from '~~/modules/sor/components/SorConfigModal';

const { Title, Paragraph, Text, Link } = Typography;

export function SorPage() {
  const { pools, poolTypes, tokens, parsedPools } = usePoolsData();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const tokenOptions = tokens.map((token) => ({ label: `${token.symbol} - ${token.address}`, value: token.address }));
  const [selectedPoolTypes, setSelectedPoolTypes] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [tokenInAddress, setTokenInAddress] = useState<string | null>(null);
  const [tokenOutAddress, setTokenOutAddress] = useState<string | null>(null);
  const [swapType, setSwapType] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const tokenIn = tokens.find((token) => token.address === tokenInAddress);
  const tokenOut = tokens.find((token) => token.address === tokenOutAddress);
  const approvalTokens = tokens.filter((token) => token.address === tokenInAddress);
  const { data: allowances, refetch: refetchTokenApprovals } = useTokenApprovals(approvalTokens);

  return (
    <div style={{ marginTop: 24, marginLeft: 18, marginRight: 18, paddingBottom: 120 }}>
      <Typography>
        <Title level={2}>Smart Order Router (SOR)</Title>
        <Paragraph>
          The Smart Order Router (SOR) is a tool designed to optimize routing across Balancer pools for the best
          possible price execution. This tool allows you to benchmark your custom pools within the context of all
          available Balancer liquidity, utilizing the SOR.
        </Paragraph>
        <Divider />
        <Title level={4}>Pool config</Title>
        <Paragraph>
          Use the inputs below to filter the pools that will be used when calculating optimal paths between two tokens.
          If you <Text strong>include specific pools</Text>, they will be included regardless of whether they meet the
          pool type or token filter criteria. If no filters are selected AND you&apos;ve{' '}
          <Text strong>included specific pools</Text>, only those pools will be used in routing.
        </Paragraph>
        <Paragraph>
          To inject custom pools you&apos;ve deployed locally, you need to implement a{' '}
          <Text keyboard>PoolDataProvider</Text> and a <Text keyboard>BasePoolFactory</Text>. The{' '}
          <Text keyboard>PoolDataProvider</Text> should fetch all necessary data for your custom pools, and the{' '}
          <Text keyboard>BasePoolFactory</Text> tells the SOR how to interact with your custom pools. Reference
          implementations can be found in <Text keyboard>some/dir/with/references</Text>.
        </Paragraph>
        <Space style={{ width: '100%' }} direction="vertical" size={12}>
          <div>
            <Text strong>Filter by pool types</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Pool types"
              onChange={setSelectedPoolTypes}
              options={poolTypes.map((type) => ({ label: type, value: type }))}
              showArrow={true}
              value={selectedPoolTypes}
            />
          </div>
          <div>
            <Text strong>Filter by tokens</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Pool tokens"
              onChange={setSelectedTokens}
              options={tokenOptions}
              showArrow={true}
              value={selectedTokens}
            />
          </div>
          <div>
            <Text strong>Include specific pools</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Pools"
              onChange={setSelectedPools}
              options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
              showArrow={true}
              value={selectedPools}
            />
          </div>
        </Space>
      </Typography>

      <Row gutter={24} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={12}>
          <div style={{ display: 'flex' }}>
            <Title level={4} style={{ flex: 1 }}>
              Swap
            </Title>
            <Button shape="circle" icon={<SettingOutlined />} onClick={() => setConfigModalOpen(true)} />
          </div>
          <Space style={{ width: '100%' }} direction="vertical" size={12}>
            <div>
              <Text strong>Swap type</Text>
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
            <div>
              <Text strong>Token in</Text>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Token in"
                onChange={setTokenInAddress}
                value={tokenInAddress}
                options={tokenOptions}
                showArrow={true}
              />
            </div>
            <div>
              <Text strong>Token out</Text>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Token out"
                onChange={setTokenOutAddress}
                value={tokenOutAddress}
                options={tokenOptions}
                showArrow={true}
              />
            </div>
            <div>
              <Text strong>Amount {swapType === 'GIVEN_OUT' ? 'out' : 'in'}</Text>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Amount ${swapType === 'GIVEN_OUT' ? 'out' : 'in'} (1 WETH = 1.0)`}
                style={{ width: '100%' }}
                type="number"
              />
            </div>
            <div style={{ display: 'flex' }}>
              <TokenApprovals
                tokensIn={approvalTokens}
                refetchAllowances={async () => {
                  await refetchTokenApprovals();
                }}
                allowances={allowances || []}
              />
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="large"
                  style={{ marginRight: 8 }}
                  onClick={async () => {
                    const tIn = new Token(1, tokenIn!.address, tokenIn!.decimals);
                    const tOut = new Token(1, tokenOut!.address, tokenOut!.decimals);
                    const tokenAmount = TokenAmount.fromHumanAmount(tIn, amount);

                    const { quote, swap } = await SmartOrderRouter.getSwapsWithPools(
                      tIn,
                      tOut,
                      SwapKind.GivenIn,
                      tokenAmount,
                      parsedPools
                    );
                  }}>
                  Query
                </Button>
                <Button size="large" type="primary">
                  Execute
                </Button>
              </div>
            </div>
          </Space>
        </Col>
        <Col span={12} style={{ border: '1px solid lightGray', borderRadius: 8 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Swap query results" />
          </div>
        </Col>
      </Row>
      <Card title="Snatch tokens" style={{ marginBottom: 64 }}>
        <TokenSnatch tokens={tokens.filter((token) => token.address === tokenInAddress)} />
      </Card>
      {/* <Title level={4} style={{ marginTop: 12 }}>
        Path graph
      </Title>
      <SorNetworkGraph
        tokens={tokens}
        pools={pools.filter((pool) => {
          if (selectedPoolTypes.length > 0 && !selectedPoolTypes.includes(pool.poolType)) {
            return false;
          }

          return true;
        })}
      />*/}
      <SorConfigModal isOpen={configModalOpen} close={() => setConfigModalOpen(false)} />
    </div>
  );
}
