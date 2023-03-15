import { Button, Input, Modal, Select } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { FC, useContext, useState } from 'react';

import { useAppContracts } from '~common/components/context';
import { MaxUint256 } from '~~/helpers/constants';
import { useBalancerQueries } from '~~/modules/pool/hooks/useBalancerQueries';
import { useTxGasPrice } from '~~/modules/pool/hooks/useTxGasPrice';
import { PoolToken } from '~~/modules/pool/pool-types';

interface Props {
  poolTokens: PoolToken[];
  poolId: string;
  initialized: boolean;
  refetchData: () => Promise<void>;
}

export const PoolContractSwapForm: FC<Props> = ({ poolTokens, poolId, initialized, refetchData }) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const { provider, account, chainId } = useEthersAppContext();
  const vault = useAppContracts('Vault', chainId);
  const gasPrice = useTxGasPrice();
  const [swapType, setSwapType] = useState<string | null>(null);
  const [tokenIn, setTokenIn] = useState<string | null>(null);
  const [tokenOut, setTokenOut] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const balancerQueries = useBalancerQueries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [querySwapResponse, setQuerySwapResponse] = useState<string>('0,0');
  const amountToken = poolTokens.find((token) =>
    swapType === 'GIVEN_IN' ? token.address === tokenIn : token.address === tokenOut
  );
  const otherToken = poolTokens.find((token) =>
    swapType === 'GIVEN_IN' ? token.address === tokenOut : token.address === tokenIn
  );

  const querySwap = async (): Promise<void> => {
    const result: BigNumber = await balancerQueries.querySwap(
      {
        poolId,
        kind: swapType === 'GIVEN_IN' ? 0 : 1,
        assetIn: tokenIn,
        assetOut: tokenOut,
        amount: parseUnits(amount, amountToken?.decimals || 18).toString(),
        userData: '0x',
      },
      {
        sender: account || '',
        fromInternalBalance: false,
        recipient: account || '',
        toInternalBalance: false,
      }
    );

    setQuerySwapResponse(formatUnits(result, otherToken?.decimals || 18));

    setIsModalOpen(true);
  };

  const swap = async (): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [account]);
    const signer = provider?.getSigner(account);

    const wrapper = transactor(settingsContext, signer, gasPrice);

    if (wrapper && account && tokenIn && tokenOut) {
      await wrapper(
        vault.swap(
          {
            poolId,
            kind: swapType === 'GIVEN_IN' ? 0 : 1,
            assetIn: tokenIn,
            assetOut: tokenOut,
            amount: parseUnits(amount, amountToken?.decimals || 18).toString(),
            userData: '0x',
          },
          {
            sender: account,
            fromInternalBalance: false,
            recipient: account,
            toInternalBalance: false,
          },
          swapType === 'GIVEN_IN' ? 0 : MaxUint256,
          MaxUint256
        )
      );
    }

    await refetchData();
  };

  return (
    <div>
      <div style={{ fontSize: 16, marginBottom: 4 }}>Swap</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          showArrow={true}
          defaultActiveFirstOption={true}
          filterOption={false}
          labelInValue={false}
          id="swapType"
          value={swapType}
          onChange={(value): void => {
            setSwapType(value);
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
          labelInValue={false}
          id="tokenIn"
          value={tokenIn}
          onChange={(value): void => {
            setTokenIn(value);
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
          labelInValue={false}
          id="tokenOut"
          value={tokenOut}
          onChange={(value): void => {
            setTokenOut(value);
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
            setAmount(e.target.value);
          }}
          value={amount}
          placeholder={`Human amount ${swapType === 'GIVEN_OUT' ? 'out' : 'in'}. ie: 10.0 = 10 WETH`}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Button
          style={{ marginRight: 8 }}
          onClick={() => {
            void querySwap();
          }}>
          Query
        </Button>
        <Button
          type="primary"
          onClick={() => {
            void swap();
          }}>
          Execute
        </Button>
      </div>
      <Modal
        title="Query Swap Response"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}>
        <div>
          {
            poolTokens.find((token) =>
              swapType === 'GIVEN_IN' ? token.address === tokenOut : token.address === tokenIn
            )?.symbol
          }{' '}
          {swapType === 'GIVEN_IN' ? 'out' : 'in'}: {querySwapResponse}
        </div>
      </Modal>
    </div>
  );
};
