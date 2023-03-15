import { defaultAbiCoder } from '@ethersproject/abi';
import { Button, Input, Modal, Select } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useContext, useState } from 'react';

import { useAppContracts } from '~common/components/context';
import { useBalancerQueries } from '~~/modules/pool/hooks/useBalancerQueries';
import { useTxGasPrice } from '~~/modules/pool/hooks/useTxGasPrice';
import { PoolToken } from '~~/modules/pool/pool-types';

interface Props {
  poolId: string;
  poolTokens: PoolToken[];
  initialized: boolean;
  refetchData: () => Promise<void>;
}

export const PoolContractExitForm: FC<Props> = ({ poolId, poolTokens, initialized, refetchData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryExitResponse, setQueryExitResponse] = useState<{ bptIn: string; amountsOut: string[] }>({
    bptIn: '0.0',
    amountsOut: [],
  });
  const [userDataItems, setUserDataItems] = useState<{ type: string; value: string | string }[]>([
    { type: 'uint256', value: '0' },
  ]);
  const settingsContext = useContext(EthComponentsSettingsContext);
  const { provider, account, chainId } = useEthersAppContext();
  const balancerQueries = useBalancerQueries();
  const vault = useAppContracts('Vault', chainId);
  const gasPrice = useTxGasPrice();

  const queryExitPool = async (): Promise<void> => {
    const result: { bptIn: BigNumber; amountsOut: BigNumber[] } = await balancerQueries.queryExit(
      poolId,
      account || '',
      account || '',
      {
        assets: poolTokens.map((token) => token.address),
        minAmountsOut: poolTokens.map(() => 0),
        userData: defaultAbiCoder.encode(
          userDataItems.map((item) => item.type),
          userDataItems.map((item) => (item.type === 'uint256[]' ? item.value.split(',') : item.value))
        ),
        toInternalBalance: false,
      }
    );

    setQueryExitResponse({
      bptIn: formatUnits(result.bptIn, 18),
      amountsOut: poolTokens.map((token, index) => formatUnits(result.amountsOut[index], token.decimals)),
    });

    setIsModalOpen(true);
  };

  const exitPool = async (): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [account]);
    const signer = provider?.getSigner(account);

    const wrapper = transactor(settingsContext, signer, gasPrice);

    if (wrapper && account) {
      console.log(poolId, account, account, {
        assets: poolTokens.map((token) => token.address),
        minAmountsOut: poolTokens.map((token) => 0),
        userData: defaultAbiCoder.encode(
          userDataItems.map((item) => item.type),
          userDataItems.map((item) => (item.type === 'uint256[]' ? item.value.split(',') : item.value))
        ),
        toInternalBalance: false,
      });
      await wrapper(
        vault.exitPool(poolId, account, account, {
          assets: poolTokens.map((token) => token.address),
          minAmountsOut: poolTokens.map((token) => 0),
          userData: defaultAbiCoder.encode(
            userDataItems.map((item) => item.type),
            userDataItems.map((item) => (item.type === 'uint256[]' ? item.value.split(',') : item.value))
          ),
          toInternalBalance: false,
        })
      );
    }

    await refetchData();
  };

  return (
    <div>
      <div style={{ fontSize: 16 }}>Exit pool</div>
      <div style={{ fontSize: 14, marginBottom: 12, color: 'gray' }}>
        To build the exit user data, select the type and then enter the value. Items will be encoded in the order they
        are specified. For uint256[], provide a comma separated list of values.
      </div>

      {userDataItems.map((userDataItem, index) => {
        return (
          <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
            <Select
              showArrow={true}
              defaultActiveFirstOption={false}
              filterOption={false}
              labelInValue={false}
              id="token"
              value={userDataItem.type}
              onChange={(e): void => {
                setUserDataItems([
                  ...userDataItems.slice(0, index),
                  { type: e, value: userDataItems[index].value },
                  ...userDataItems.slice(index + 1),
                ]);
              }}
              notFoundContent={null}
              style={{ width: '200px', marginRight: 12 }}>
              <Select.Option value="uint8">
                <div>uint8</div>
              </Select.Option>
              <Select.Option value="uint256">
                <div>uint256</div>
              </Select.Option>
              <Select.Option value="uint256[]">
                <div>uint256[]</div>
              </Select.Option>
            </Select>
            <Input
              value={userDataItems[index].value}
              onChange={(e): void => {
                setUserDataItems([
                  ...userDataItems.slice(0, index),
                  { type: userDataItems[index].type, value: e.target.value },
                  ...userDataItems.slice(index + 1),
                ]);
              }}
              placeholder={'Asset values should be provided in scaled form ie: 1 WETH = 1000000000000000000'}
            />
          </div>
        );
      })}
      <div style={{ display: 'flex', marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => setUserDataItems([...userDataItems, { type: 'uint256', value: '' }])}
            type="primary">
            Add
          </Button>
          <Button onClick={() => setUserDataItems(userDataItems.slice(0, userDataItems.length - 1))}>Remove</Button>
        </div>
        <div style={{ display: 'flex' }}>
          <Button
            style={{ marginRight: 8 }}
            disabled={!initialized}
            onClick={() => {
              void queryExitPool();
            }}>
            Query
          </Button>
          <Button
            type="primary"
            onClick={() => {
              void exitPool();
            }}>
            Execute
          </Button>
        </div>
      </div>
      <Modal
        title="Query Exit Response"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}>
        <div>BPT In: {queryExitResponse.bptIn}</div>
        <div style={{ marginTop: 12 }}>Amounts out:</div>
        {queryExitResponse.amountsOut.map((amount, index) => (
          <div key={index}>
            {poolTokens[index].symbol}: {amount}
          </div>
        ))}
      </Modal>
    </div>
  );
};
