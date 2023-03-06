import { BatchSwapStep, RawPoolToken, ZERO_ADDRESS } from '@balancer/sdk';
import { formatFixed } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { Alert, Button, Card, Col, Input, Row, Space, Typography } from 'antd';
import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import { cloneDeep, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';

import { MaxUint256 } from '~~/helpers/constants';
import { getToken } from '~~/helpers/tokens';
import { useTokenApprovals } from '~~/hooks/useTokenApprovals';
import { useVault } from '~~/hooks/useVault';
import { BatchSwapPathData, BatchSwapType } from '~~/modules/batchswap/batchswap-types';
import { BatchSwapSettings } from '~~/modules/batchswap/components/BatchSwapSettings';
import { BatchSwapTokenApprovals } from '~~/modules/batchswap/components/BatchSwapTokenApprovals';

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
  const [isQuerying, setIsQuerying] = useState(false);
  const [queried, setQueried] = useState<{ swapType: BatchSwapType; paths: BatchSwapPathData[] } | null>(null);

  useEffect(() => {
    if (assetDeltas.length > 0 && JSON.stringify(queried) !== JSON.stringify({ swapType, paths })) {
      setAssetDeltas([]);
    }
  }, [swapType, JSON.stringify(paths)]);

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
    setIsQuerying(true);
    const response: BigNumber[] = await vault.queryBatchSwap(isGivenIn ? 0 : 1, batchSwapSteps, assets, {
      sender,
      fromInternalBalance,
      recipient,
      toInternalBalance,
    });

    setAssetDeltas(response.map((item) => item.toString()));
    setQueried(cloneDeep({ swapType, paths }));
    setIsQuerying(false);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <BatchSwapSettings
            fromInternalBalance={fromInternalBalance}
            toInternalBalance={toInternalBalance}
            sender={sender}
            recipient={recipient}
            setFromInternalBalance={setFromInternalBalance}
            setToInternalBalance={setToInternalBalance}
            setSender={setSender}
            setRecipient={setRecipient}
            slippage={slippage}
            setSlippage={setSlippage}
            deadline={deadline}
            setDeadline={setDeadline}
          />
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
      <div style={{ display: 'flex', marginTop: 12, marginBottom: 12, alignItems: 'flex-end' }}>
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
          <Button size="large" disabled={!isPathInputValid} loading={isQuerying} onClick={queryBatchSwap}>
            Query
          </Button>
          <Button size="large" disabled={true} type="primary" onClick={() => {}}>
            Execute
          </Button>
        </Space>
      </div>
      {isPathInputValid && assetDeltas.length > 0 && (
        <Alert
          message={
            <Space direction="vertical" size={4}>
              <Typography.Text strong style={{ fontSize: 20 }}>
                Query results
              </Typography.Text>
              <Typography.Text>
                Since the same token can appear multiple times, we show the combined asset deltas that would result from
                the batch swap. Positive values are amounts spent by the sender. Negative values are amounts sent to the
                recipient. 0 values are likely hop tokens.
              </Typography.Text>
              {assetDeltas.map((delta, index) => {
                const token = getToken(assets[index], tokens);

                return (
                  <div key={index}>
                    {formatFixed(delta, token?.decimals || 18)} {token?.symbol}
                  </div>
                );
              })}
              <div>Asset deltas: {assetDeltas.join(',')}</div>
            </Space>
          }
          type="success"
        />
      )}
    </div>
  );
}
