import { Card, Checkbox, Input, Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface Props {
  fromInternalBalance: boolean;
  toInternalBalance: boolean;
  sender: string;
  recipient: string;
  setFromInternalBalance: (value: boolean) => void;
  setToInternalBalance: (value: boolean) => void;
  setSender: (value: string) => void;
  setRecipient: (value: string) => void;
  slippage: string;
  setSlippage: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
}

export function BatchSwapSettings({
  fromInternalBalance,
  toInternalBalance,
  setFromInternalBalance,
  setToInternalBalance,
  sender,
  setSender,
  slippage,
  setSlippage,
  recipient,
  setRecipient,
  deadline,
  setDeadline,
}: Props) {
  return (
    <Card title="Settings">
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <div>
          <div style={{ display: 'flex', marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <Text strong>Sender</Text>
            </div>
            From internal balance
            <Checkbox
              style={{ marginLeft: 8 }}
              onChange={(e) => setFromInternalBalance(e.target.value)}
              value={fromInternalBalance}
            />
          </div>
          <Input
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Sender"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <div style={{ display: 'flex', marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <Text strong>Recipient</Text>
            </div>
            To internal balance
            <Checkbox
              style={{ marginLeft: 8 }}
              onChange={(e) => setToInternalBalance(e.target.value)}
              value={toInternalBalance}
            />
          </div>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <Text strong>Slippage</Text>
          <Input
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            placeholder={`Slippage 1 = 1%`}
            style={{ width: '100%' }}
            type="number"
            min={0}
          />
        </div>
        <div>
          <Text strong>Deadline</Text>
          <Input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder={`0 or empty for no deadline`}
            style={{ width: '100%' }}
            type="number"
            min={0}
          />
        </div>
        <Text italic style={{ color: 'gray' }}>
          The settings above are not required for queries.
        </Text>
      </Space>
    </Card>
  );
}
