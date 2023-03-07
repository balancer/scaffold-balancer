import { Input, Select, Space, Typography } from 'antd';
import React from 'react';

import { SwapType } from '~~/modules/batchswap/batchswap-types';

const { Title, Text } = Typography;

interface Props {
  tokenOptions: { label: string; value: string }[];
  swapType: SwapType | null;
  setSwapType: (value: SwapType | null) => void;
  tokenInAddress: string | null;
  setTokenInAddress: (value: string | null) => void;
  tokenOutAddress: string | null;
  setTokenOutAddress: (value: string | null) => void;
  amount: string;
  setAmount: (value: string) => void;
}

export function SorSwapConfig({
  tokenOptions,
  swapType,
  setSwapType,
  tokenInAddress,
  setTokenOutAddress,
  setTokenInAddress,
  tokenOutAddress,
  amount,
  setAmount,
}: Props) {
  return (
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
          showSearch
          optionFilterProp="label"
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
          showSearch
          optionFilterProp="label"
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
    </Space>
  );
}
