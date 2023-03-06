import { RawPoolToken } from '@balancer/sdk';
import { Button, Space } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { Interface } from 'ethers/lib/utils';
import React, { useContext } from 'react';

import { useAppContracts } from '~common/components/context';
import { ERC20__factory } from '~common/generated/contract-types';
import { MaxUint256 } from '~~/helpers/constants';
import { useTxGasPrice } from '~~/modules/pool/hooks/useTxGasPrice';
import { PoolToken } from '~~/modules/pool/pool-types';

interface Props {
  tokensIn: RawPoolToken[];
  refetchAllowances: () => Promise<void>;
  allowances: (PoolToken & { allowance: string })[];
}

export function TokenApprovals({ tokensIn, allowances, refetchAllowances }: Props) {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const { provider, account, chainId } = useEthersAppContext();
  const vault = useAppContracts('Vault', chainId);
  const gasPrice = useTxGasPrice();

  const approve = async (tokenAddress: string): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [account]);
    const signer = provider?.getSigner(account);
    const tokenInterface = new Interface(ERC20__factory.abi);

    const data = tokenInterface.encodeFunctionData('approve', [vault.address, MaxUint256]);

    const wrapper = transactor(settingsContext, signer, gasPrice);

    if (wrapper) {
      await wrapper({ to: tokenAddress, data });
      await refetchAllowances();
    }
  };

  return (
    <Space direction="horizontal">
      {tokensIn.map((token) => {
        const allowance = allowances?.find((allowance) => allowance.address === token.address)?.allowance;
        return (
          <Button
            key={token.address}
            type="primary"
            disabled={!!allowance && allowance !== '0.0'}
            onClick={(): void => {
              void approve(token.address);
            }}>
            Approve {token?.symbol}
          </Button>
        );
      })}
    </Space>
  );
}
