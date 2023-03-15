import { Card, Col, Divider, Row } from 'antd';
import { Address } from 'eth-components/ant';
import { FC } from 'react';

import { TokenSnatch } from '~~/components/TokenSnatch';
import { useTokenBalances } from '~~/hooks/useTokenBalances';
import { PoolApproveAssetsForm } from '~~/modules/pool/components/PoolApproveAssetsForm';
import { PoolContractExitForm } from '~~/modules/pool/components/PoolContractExitForm';
import { PoolContractJoinForm } from '~~/modules/pool/components/PoolContractJoinForm';
import { PoolContractSwapForm } from '~~/modules/pool/components/PoolContractSwapForm';
import { usePoolData } from '~~/modules/pool/hooks/usePoolData';

interface Props {
  address: string;
}

export const PoolContract: FC<Props> = ({ address }) => {
  const { data, refetch } = usePoolData(address);
  const { refetch: refetchTokenBalances } = useTokenBalances(data?.poolTokens || []);

  return (
    <div style={{ margin: 'auto', width: '70vw' }}>
      <Card
        title={
          <div style={{ fontSize: 18, display: 'flex', textAlign: 'left' }}>
            <div style={{ flex: 1 }}>
              <div>
                {data?.name} ({data?.symbol})
              </div>
              <div style={{ fontSize: 9 }}>ID: {data?.poolId}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 14 }}>
              <div>
                Address: <Address address={data?.address} fontSize={14} />
              </div>
              <div>
                Owner: <Address address={data?.owner} fontSize={14} />
              </div>
            </div>
          </div>
        }
        size="default"
        style={{ marginTop: 25, width: '100%' }}>
        {/* //loading={contractDisplay && contractDisplay.length <= 0}>*/}
        <Row style={{ margin: 0, padding: 0, fontSize: 14 }}>
          <Col span={8}>Pool tokens</Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            {data?.poolTokens.map((token) => (
              <div key={token.address}>
                <span style={{ marginRight: 4 }}>{`${token.balance} ${token.symbol}`}</span>
                <Address address={token.address} fontSize={14} />
              </div>
            ))}
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0' }} />
        <Row style={{ margin: 0, padding: 0, fontSize: 14 }}>
          <Col span={8}>Swap fee percentage</Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            {data?.swapFeePercentage}%
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0' }} />
        <Row style={{ margin: 0, padding: 0, fontSize: 14 }}>
          <Col span={8}>Total supply</Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            {data?.totalSupply}
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0' }} />
        <Row style={{ margin: 0, padding: 0, fontSize: 14 }}>
          <Col span={8}>Vault</Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Address address={data?.vaultAddress} fontSize={14} />
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />
        <TokenSnatch tokens={data?.poolTokens || []} />
        <Divider style={{ margin: '18px 0' }} />
        <PoolApproveAssetsForm poolTokens={data?.poolTokens || []} />
        <Divider style={{ margin: '18px 0' }} />
        {data && (
          <PoolContractJoinForm
            poolId={data.poolId}
            poolTokens={data.poolTokens}
            initialized={data && data.totalSupply !== '0.0'}
            refetchData={async () => {
              await refetch();
              await refetchTokenBalances();
            }}
          />
        )}
        <Divider style={{ margin: '18px 0' }} />
        {data && (
          <PoolContractSwapForm
            poolId={data.poolId}
            poolTokens={data.poolTokens}
            initialized={data && data.totalSupply !== '0.0'}
            refetchData={async () => {
              await refetch();
              await refetchTokenBalances();
            }}
          />
        )}
        <Divider style={{ margin: '18px 0' }} />
        {data && (
          <PoolContractExitForm
            poolId={data.poolId}
            poolTokens={data.poolTokens}
            initialized={data && data.totalSupply !== '0.0'}
            refetchData={async () => {
              await refetch();
              await refetchTokenBalances();
            }}
          />
        )}
        <div style={{ height: 24 }} />
      </Card>
    </div>
  );
};
