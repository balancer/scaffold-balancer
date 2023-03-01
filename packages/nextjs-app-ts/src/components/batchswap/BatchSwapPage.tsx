import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Input, Row, Select, Space, Steps, Typography } from 'antd';
import React, { useState } from 'react';

import { usePoolsData } from '~~/components/hooks/usePoolsData';

const { Title, Paragraph, Text, Link } = Typography;

export function BatchSwapPage() {
  const { pools, poolTypes, tokens } = usePoolsData();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const tokenOptions = tokens.map((token) => ({ label: `${token.symbol} - ${token.address}`, value: token.address }));
  const [selectedPoolTypes, setSelectedPoolTypes] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [tokenIn, setTokenIn] = useState<string | null>(null);
  const [tokenOut, setTokenOut] = useState<string | null>(null);
  const [swapType, setSwapType] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  const description = 'This is a description.';
  return (
    <div style={{ marginTop: 24, marginLeft: 18, marginRight: 18, paddingBottom: 120 }}>
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
            swap.
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
        <Space align="start">
          <Card title="Path 1" style={{ width: '400px' }}>
            <Steps direction="vertical">
              <Steps.Step
                title="Hop 1"
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token in"
                          onChange={setTokenIn}
                          value={tokenIn}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token out"
                          onChange={setTokenOut}
                          value={tokenOut}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                    </Row>
                  </Space>
                }
              />
              <Steps.Step
                title={
                  <Space direction="horizontal">
                    <div>Hop 2</div>
                    <Button icon={<DeleteOutlined />} danger type="text" />
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Token out"
                      onChange={setTokenOut}
                      value={tokenOut}
                      options={tokenOptions}
                      showArrow={true}
                    />
                  </Space>
                }
              />
            </Steps>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginTop: 4, marginBottom: 20 }} icon={<PlusCircleOutlined />} type="primary">
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
          <Card title="Path 2" style={{ width: '400px' }}>
            <Steps direction="vertical">
              <Steps.Step
                title="Hop 1"
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token in"
                          onChange={setTokenIn}
                          value={tokenIn}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token out"
                          onChange={setTokenOut}
                          value={tokenOut}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                    </Row>
                  </Space>
                }
              />
              <Steps.Step
                title={
                  <Space direction="horizontal">
                    <div>Hop 2</div>
                    <Button icon={<DeleteOutlined />} danger type="text" />
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Token out"
                      onChange={setTokenOut}
                      value={tokenOut}
                      options={tokenOptions}
                      showArrow={true}
                    />
                  </Space>
                }
              />
            </Steps>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginTop: 4, marginBottom: 20 }} icon={<PlusCircleOutlined />} type="primary">
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
          <Card title="Path 3" style={{ width: '400px' }}>
            <Steps direction="vertical">
              <Steps.Step
                title="Hop 1"
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token in"
                          onChange={setTokenIn}
                          value={tokenIn}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                      <Col span={12}>
                        <Select
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="Token out"
                          onChange={setTokenOut}
                          value={tokenOut}
                          options={tokenOptions}
                          showArrow={true}
                        />
                      </Col>
                    </Row>
                  </Space>
                }
              />
              <Steps.Step
                title={
                  <Space direction="horizontal">
                    <div>Hop 2</div>
                    <Button icon={<DeleteOutlined />} danger type="text" />
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Pool"
                        onChange={setSelectedPools}
                        options={pools.map((pool) => ({ label: `${pool.symbol} - ${pool.id}`, value: pool.id }))}
                        showArrow={true}
                        value={selectedPools}
                      />
                    </div>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Token out"
                      onChange={setTokenOut}
                      value={tokenOut}
                      options={tokenOptions}
                      showArrow={true}
                    />
                  </Space>
                }
              />
            </Steps>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginTop: 4, marginBottom: 20 }} icon={<PlusCircleOutlined />} type="primary">
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
          <div style={{ marginLeft: 8 }}>
            <Button type="primary">Add path</Button>
          </div>
        </Space>
      </Typography>
    </div>
  );
}
