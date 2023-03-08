import { SettingOutlined } from '@ant-design/icons';
import { SmartOrderRouter, SwapInfo, SwapKind, Token, TokenAmount } from '@balancer/sdk';
import { Button, Card, Col, Empty, Row, Typography } from 'antd';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { useEffect, useState } from 'react';

import { TokenApprovals } from '~~/components/TokenApprovals';
import { TokenSnatch } from '~~/components/TokenSnatch';
import { usePoolsData } from '~~/hooks/usePoolsData';
import { useTokenApprovals } from '~~/hooks/useTokenApprovals';
import { SwapType } from '~~/modules/batchswap/batchswap-types';
import { SorConfigModal } from '~~/modules/sor/components/SorConfigModal';
import { SorPageHeader } from '~~/modules/sor/components/SorPageHeader';
import { SorPoolConfig } from '~~/modules/sor/components/SorPoolConfig';
import { SorSwapConfig } from '~~/modules/sor/components/SorSwapConfig';
import { SorSwapQueryResults } from '~~/modules/sor/components/SorSwapQueryResults';

const { Title } = Typography;

export function SorPage() {
  const { pools, poolTypes, tokens, parsedPools } = usePoolsData();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const tokenOptions = tokens.map((token) => ({ label: `${token.symbol} - ${token.address}`, value: token.address }));
  const [selectedPoolTypes, setSelectedPoolTypes] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [tokenInAddress, setTokenInAddress] = useState<string | null>(null);
  const [tokenOutAddress, setTokenOutAddress] = useState<string | null>(null);
  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [swapInfo, setSwapInfo] = useState<SwapInfo | null>(null);
  const tokenIn = tokens.find((token) => token.address === tokenInAddress);
  const tokenOut = tokens.find((token) => token.address === tokenOutAddress);
  const approvalTokens = tokens.filter((token) => token.address === tokenInAddress);
  const { chainId, provider } = useEthersAppContext();

  useEffect(() => {
    if (swapInfo) {
      setSwapInfo(null);
    }
  }, [
    selectedPoolTypes.join(),
    selectedTokens.join(),
    selectedPools.join(),
    swapType,
    tokenInAddress,
    tokenOutAddress,
    amount,
  ]);

  const filteredPools = pools.filter((pool) => {
    if (selectedPools.length > 0 && selectedPools.includes(pool.id)) {
      return true;
    }

    if (selectedPoolTypes.length > 0 && !selectedPoolTypes.includes(pool.poolType)) {
      return false;
    }

    if (
      selectedTokens.length > 0 &&
      pool.tokens.filter((token) => selectedTokens.includes(token.address)).length === 0
    ) {
      return false;
    }

    if (selectedPoolTypes.length === 0 && selectedTokens.length === 0 && selectedPools.length > 0) {
      return false;
    }

    return true;
  });

  const { data: allowances, refetch: refetchTokenApprovals } = useTokenApprovals(approvalTokens);

  return (
    <div style={{ marginTop: 24, marginLeft: 18, marginRight: 18, paddingBottom: 120 }}>
      <Typography>
        <SorPageHeader />
        <SorPoolConfig
          pools={pools}
          poolTypes={poolTypes}
          tokenOptions={tokenOptions}
          selectedPoolTypes={selectedPoolTypes}
          setSelectedPoolTypes={setSelectedPoolTypes}
          selectedPools={selectedPools}
          setSelectedPools={setSelectedPools}
          selectedTokens={selectedTokens}
          setSelectedTokens={setSelectedTokens}
        />
      </Typography>

      <Row gutter={24} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={12}>
          <div style={{ display: 'flex' }}>
            <Title level={4} style={{ flex: 1 }}>
              Swap
            </Title>
            <Button shape="circle" icon={<SettingOutlined />} onClick={() => setConfigModalOpen(true)} />
          </div>
          <SorSwapConfig
            tokenOptions={tokenOptions}
            swapType={swapType}
            setSwapType={setSwapType}
            tokenInAddress={tokenInAddress}
            setTokenInAddress={setTokenInAddress}
            tokenOutAddress={tokenOutAddress}
            setTokenOutAddress={setTokenOutAddress}
            amount={amount}
            setAmount={setAmount}
          />
          <div style={{ display: 'flex', marginTop: 12 }}>
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
                  if (tokenIn && tokenOut) {
                    const tIn = new Token(1, tokenIn.address, tokenIn.decimals);
                    const tOut = new Token(1, tokenOut.address, tokenOut.decimals);
                    const tokenAmount = TokenAmount.fromHumanAmount(swapType === 'GIVEN_OUT' ? tOut : tIn, amount);

                    const parsedPools = SmartOrderRouter.parseRawPools({
                      chainId: chainId || 1,
                      pools: filteredPools,
                      customPoolFactories: [],
                    });

                    const result = await SmartOrderRouter.getSwapsWithPools(
                      tIn,
                      tOut,
                      swapType === 'GIVEN_OUT' ? SwapKind.GivenOut : SwapKind.GivenIn,
                      tokenAmount,
                      parsedPools
                    );

                    setSwapInfo(result);
                  }
                }}>
                Query
              </Button>
              <Button size="large" type="primary">
                Execute
              </Button>
            </div>
          </div>
        </Col>
        <Col span={12} style={{ border: '1px solid lightGray', borderRadius: 8 }}>
          {swapInfo && swapType && tokenIn && tokenOut ? (
            <SorSwapQueryResults
              swapInfo={swapInfo}
              swapType={swapType}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              tokens={tokens}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Swap query results" />
            </div>
          )}
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
