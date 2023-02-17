/*
function queryJoin(
        bytes32 poolId,
        address sender,
        address recipient,
        IVault.JoinPoolRequest memory request
    ) external override returns (uint256 bptOut, uint256[] memory amountsIn) {
        (address pool, ) = vault.getPool(poolId);
        (uint256[] memory balances, uint256 lastChangeBlock) = _validateAssetsAndGetBalances(poolId, request.assets);
        IProtocolFeesCollector feesCollector = vault.getProtocolFeesCollector();

        (bptOut, amountsIn) = IBasePool(pool).queryJoin(
            poolId,
            sender,
            recipient,
            balances,
            lastChangeBlock,
            feesCollector.getSwapFeePercentage(),
            request.userData
        );
    }

    struct JoinPoolRequest {
        IAsset[] assets;
        uint256[] maxAmountsIn;
        bytes userData;
        bool fromInternalBalance;
    }
 */

import { Button, Input, Select } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { Interface, parseUnits } from 'ethers/lib/utils';
import React, { FC, useContext, useState } from 'react';

import { useAppContracts } from '~common/components/context';
import { ERC20__factory } from '~common/generated/contract-types';
import { useTokenBalances } from '~~/components/pool/hooks/useTokenBalances';
import { PoolToken } from '~~/components/pool/pool-types';

export const MAX_UINT112 = '5192296858534827628530496329220095';
import { defaultAbiCoder } from '@ethersproject/abi';

interface Props {
  poolId: string;
  poolTokens: PoolToken[];
}

export const PoolContractJoinForm: FC<Props> = ({ poolId, poolTokens }) => {
  const [userDataItems, setUserDataItems] = useState<{ type: string; value: string | string }[]>([
    { type: 'uint256', value: '0' },
  ]);

  const { data: poolTokensWithUserBalance, refetch } = useTokenBalances(poolTokens);
  const settingsContext = useContext(EthComponentsSettingsContext);
  const [token, setToken] = useState<string | null>(null);
  const [addressToSnatchFrom, setAddressToSnatchFrom] = useState<string>('');
  const [amountToSnatch, setAmountToSnatch] = useState<string>('');
  const { provider, account, chainId } = useEthersAppContext();
  const balancerQueries = useAppContracts('BalancerQueries', chainId);

  const queryJoin = async (): Promise<void> => {
    const result = await balancerQueries.queryJoin(poolId, account || '', account || '', {
      assets: poolTokens.map((token) => token.address),
      maxAmountsIn: poolTokens.map((token) => MAX_UINT112),
      userData: defaultAbiCoder.encode(
        userDataItems.map((item) => item.type),
        userDataItems.map((item) => (item.type === 'uint256[]' ? item.value.split(',') : item.value))
      ),
      fromInternalBalance: false,
    });
  };

  const snatch = async (): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [addressToSnatchFrom]);
    const signer = provider?.getSigner(addressToSnatchFrom);
    const tokenInterface = new Interface(ERC20__factory.abi);

    const data = tokenInterface.encodeFunctionData('transfer', [account, parseUnits(amountToSnatch, 18)]);

    // TODO: do proper gas estimations
    const wrapper = transactor(settingsContext, signer, 9234184629);

    if (wrapper) {
      await wrapper({ to: token || '', data });
      await refetch();
    }
  };

  return (
    <div>
      <div style={{ fontSize: 16 }}>Join pool</div>
      <div style={{ fontSize: 14, marginBottom: 12, color: 'gray' }}>
        To build your join user data, select the type and then enter the value. Items will be encoded in they order they
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
                console.log('value', [
                  ...userDataItems.slice(0, index),
                  { type: userDataItems[index].type, value: e.target.value },
                  ...userDataItems.slice(index + 1),
                ]);
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
            onClick={() => {
              void queryJoin();
            }}>
            Query
          </Button>
          <Button type="primary">Execute</Button>
        </div>
      </div>
    </div>
  );
};
