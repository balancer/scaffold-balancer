import { Card, Col, Divider, Row } from 'antd';
import { Address } from 'eth-components/ant';
import { FC } from 'react';

import { usePoolData } from '~~/components/pool/hooks/usePoolData';
import { useTokenBalances } from '~~/components/pool/hooks/useTokenBalances';
import { PoolApproveAssetsForm } from '~~/components/pool/PoolApproveAssetsForm';
import { PoolContractGetAssetsForm } from '~~/components/pool/PoolContractGetAssetsForm';
import { PoolContractJoinForm } from '~~/components/pool/PoolContractJoinForm';
import { PoolContractSwapForm } from '~~/components/pool/PoolContractSwapForm';

interface Props {
  address: string;
}

export const PoolContract: FC<Props> = ({ address }) => {
  const { data, error, refetch } = usePoolData(address);
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
        <PoolContractGetAssetsForm poolTokens={data?.poolTokens || []} />
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
        <div style={{ height: 200 }} />
      </Card>
    </div>
  );
};
