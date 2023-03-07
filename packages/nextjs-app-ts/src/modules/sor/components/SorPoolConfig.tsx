import { Select, Space, Typography } from 'antd';
import React from 'react';

import { RawPoolExtended } from '~~/hooks/usePoolsData';

const { Text } = Typography;

interface Props {
  pools: RawPoolExtended[];
  poolTypes: string[];
  tokenOptions: { label: string; value: string }[];
  selectedPoolTypes: string[];
  setSelectedPoolTypes: (value: string[]) => void;
  selectedPools: string[];
  setSelectedPools: (value: string[]) => void;
  selectedTokens: string[];
  setSelectedTokens: (value: string[]) => void;
}

export function SorPoolConfig({
  pools,
  poolTypes,
  tokenOptions,
  selectedPools,
  selectedPoolTypes,
  selectedTokens,
  setSelectedPools,
  setSelectedPoolTypes,
  setSelectedTokens,
}: Props) {
  return (
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
          showSearch
          optionFilterProp="label"
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
          showSearch
          optionFilterProp="label"
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
          showSearch
          optionFilterProp="label"
        />
      </div>
    </Space>
  );
}
