import { BatchSwapStep, RawPoolToken, ZERO_ADDRESS } from '@balancer/sdk';
import { parseUnits } from '@ethersproject/units';
import { Alert, Button, Card, Checkbox, Col, Input, Row, Space, Typography } from 'antd';
import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import { uniq } from 'lodash';
import React, { useState } from 'react';

import { MaxUint256 } from '~~/helpers/constants';
import { useTokenApprovals } from '~~/hooks/useTokenApprovals';
import { useVault } from '~~/hooks/useVault';
import { BatchSwapPathData, BatchSwapType } from '~~/modules/batchswap/batchswap-types';
import { BatchSwapTokenApprovals } from '~~/modules/batchswap/components/BatchSwapTokenApprovals';

const { Text } = Typography;

interface Props {
  swapType: BatchSwapType;
  paths: BatchSwapPathData[];
  tokens: RawPoolToken[];
}

export function BatchSwapData({ tokens, swapType, paths }: Props) {
  const vault = useVault();
  const isGivenIn = swapType === 'GIVEN_IN';
  const { account } = useEthersAppContext();
  const [activeDataTab, setActiveDataTab] = useState<string>('data');
  const [sender, setSender] = useState(account || ZERO_ADDRESS);
  const [recipient, setRecipient] = useState(account || ZERO_ADDRESS);
  const [fromInternalBalance, setFromInternalBalance] = useState(false);
  const [toInternalBalance, setToInternalBalance] = useState(false);
  const [assetDeltas, setAssetDeltas] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [slippage, setSlippage] = useState('0.25');
  const isPathInputValid =
    paths.filter(
      (path) =>
        path.tokenIn &&
        path.amount &&
        path.hops.length > 0 &&
        path.hops.filter((hop) => !hop.poolId || !hop.tokenOut).length === 0
    ).length === paths.length;

  const assets = isPathInputValid
    ? uniq(paths.map((path) => [path.tokenIn!, ...path.hops.map((hop) => hop.tokenOut!)]).flat())
    : [];
  const tokensIn = isPathInputValid
    ? uniq(paths.map((path) => path.tokenIn!)).map((asset) => tokens.find((token) => token.address === asset)!)
    : [];
  const { data: allowances, refetch: refetchTokenApprovals } = useTokenApprovals(tokensIn);

  const batchSwapSteps: BatchSwapStep[] = isPathInputValid
    ? paths
        .map((path) => {
          const tokenAddress = isGivenIn ? path.tokenIn : path.hops[path.hops.length - 1].tokenOut;
          const token = tokens.find((token) => token.address === tokenAddress);
          const amount = parseUnits(path.amount, token?.decimals || 18).toString();
          const steps = path.hops.map((hop, idx) => ({
            poolId: hop.poolId!,
            assetInIndex: assets.findIndex((asset) =>
              idx === 0 ? asset === path.tokenIn : asset === path.hops[idx - 1].tokenOut
            ),
            assetOutIndex: assets.findIndex((asset) => asset === hop.tokenOut),
            amount: (idx === 0 && isGivenIn) || (idx === path.hops.length - 1 && !isGivenIn) ? amount : '0',
            userData: '0x',
          }));

          return isGivenIn ? steps : steps.reverse();
        })
        .flat()
    : [];

  const queryBatchSwap = async (): Promise<void> => {
    const response: BigNumber[] = await vault.queryBatchSwap(isGivenIn ? 0 : 1, batchSwapSteps, assets, {
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance,
    });

    setAssetDeltas(response.map((item) => item.toString()));
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Card
            style={{ width: '100%' }}
            tabList={[
              { key: 'data', tab: 'Data' },
              { key: 'query', tab: 'Query Encoded' },
              { key: 'swap', tab: 'Swap Encoded' },
            ]}
            activeTabKey={activeDataTab}
            onTabChange={setActiveDataTab}>
            {!isPathInputValid && <Input.TextArea rows={12} readOnly={true} />}
            {isPathInputValid && activeDataTab === 'data' && (
              <Input.TextArea
                rows={12}
                readOnly={true}
                value={JSON.stringify(
                  {
                    assets,
                    steps: batchSwapSteps,
                    limits: [],
                    deadline: deadline || MaxUint256.toString(),
                    funds: { sender, fromInternalBalance, recipient, toInternalBalance },
                  },
                  null,
                  4
                )}
              />
            )}
            {isPathInputValid && activeDataTab === 'query' && (
              <Input.TextArea
                rows={12}
                readOnly={true}
                value={vault.interface.encodeFunctionData('queryBatchSwap', [
                  isGivenIn ? 0 : 1,
                  batchSwapSteps,
                  assets,
                  { sender, fromInternalBalance, recipient, toInternalBalance },
                ])}
              />
            )}
            {isPathInputValid && activeDataTab === 'swap' && (
              <Input.TextArea
                rows={12}
                readOnly={true}
                value={vault.interface.encodeFunctionData('batchSwap', [
                  isGivenIn ? 0 : 1,
                  batchSwapSteps,
                  assets,
                  { sender, fromInternalBalance, recipient, toInternalBalance },
                  [],
                  deadline || MaxUint256.toString(),
                ])}
              />
            )}
          </Card>
        </Col>
      </Row>
      <div style={{ display: 'flex', marginTop: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <BatchSwapTokenApprovals
            tokensIn={tokensIn}
            refetchAllowances={async () => {
              await refetchTokenApprovals();
            }}
            allowances={allowances || []}
          />
        </div>
        <Space direction="horizontal">
          <Button
            disabled={!isPathInputValid}
            onClick={() => {
              void queryBatchSwap();
            }}>
            Query
          </Button>
          <Button disabled={true} type="primary" onClick={() => {}}>
            Execute
          </Button>
        </Space>
      </div>
      {assetDeltas.length > 0 && <Alert message={assetDeltas.join(',')} type="success" />}
    </div>
  );
}
