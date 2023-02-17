import { Button, Input, Select } from 'antd';
import React, { FC, useState } from 'react';

import { PoolToken } from '~~/components/pool/hooks/usePoolData';

interface Props {
  poolTokens: PoolToken[];
}

export const PoolContractSwapForm: FC<Props> = ({ poolTokens }) => {
  const [swapType, setSwapType] = useState<string | null>(null);
  const [tokenIn, setTokenIn] = useState<string | null>(null);
  const [tokenOut, setTokenOut] = useState<string | null>(null);

  return (
    <div>
      <div style={{ fontSize: 16, marginBottom: 4 }}>Swap</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          showArrow={true}
          defaultActiveFirstOption={true}
          filterOption={false}
          labelInValue={true}
          id="swapType"
          value={swapType}
          onChange={(e): void => {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setSwapType(e.value);
          }}
          placeholder="Swap type"
          notFoundContent={null}
          style={{ width: '200px', marginRight: 12 }}>
          <Select.Option value="GIVEN_IN">
            <div>Given In</div>
          </Select.Option>
          <Select.Option value="GIVEN_OUT">
            <div>Given Out</div>
          </Select.Option>
        </Select>

        <Select
          showArrow={true}
          defaultActiveFirstOption={false}
          filterOption={false}
          labelInValue={true}
          id="tokenIn"
          value={tokenIn}
          onChange={(e): void => {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setTokenIn(e.value);
          }}
          placeholder="Token in"
          notFoundContent={null}
          style={{ width: '200px', marginRight: 12 }}>
          {poolTokens.map((token) => (
            <Select.Option key={token.address} value={token.address}>
              <div>{token.symbol}</div>
            </Select.Option>
          ))}
        </Select>
        <div style={{ width: 100, textAlign: 'center' }}>{'->'}</div>
        <Select
          showArrow={true}
          defaultActiveFirstOption={false}
          filterOption={false}
          labelInValue={true}
          id="tokenOut"
          value={tokenOut}
          onChange={(e): void => {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setTokenOut(e.value);
          }}
          placeholder="Token out"
          notFoundContent={null}
          style={{ width: '200px', marginRight: 12 }}>
          {poolTokens.map((token) => (
            <Select.Option key={token.address} value={token.address}>
              <div>{token.symbol}</div>
            </Select.Option>
          ))}
        </Select>
        <Input
          onChange={(e) => {
            // setNewPurpose(e.target.value);
          }}
          placeholder={swapType === 'GIVEN_OUT' ? 'Amount out' : 'Amount in'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Button style={{ marginRight: 8 }}>Query</Button>
        <Button type="primary">Execute</Button>
      </div>
    </div>
  );
};
