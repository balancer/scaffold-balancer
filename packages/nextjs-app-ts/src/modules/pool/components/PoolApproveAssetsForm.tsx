import { Button } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { Interface } from 'ethers/lib/utils';
import React, { FC, useContext } from 'react';

import { useAppContracts } from '~common/components/context';
import { ERC20__factory } from '~common/generated/contract-types';
import { MaxUint256 } from '~~/helpers/constants';
import { useTokenApprovals } from '~~/hooks/useTokenApprovals';
import { useTxGasPrice } from '~~/modules/pool/hooks/useTxGasPrice';
import { PoolToken } from '~~/modules/pool/pool-types';

interface Props {
  poolTokens: PoolToken[];
}

export const PoolApproveAssetsForm: FC<Props> = ({ poolTokens }) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const { provider, account, chainId } = useEthersAppContext();
  const vault = useAppContracts('Vault', chainId);
  const { data, refetch } = useTokenApprovals(poolTokens);
  const gasPrice = useTxGasPrice();

  const approve = async (tokenAddress: string): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [account]);
    const signer = provider?.getSigner(account);
    const tokenInterface = new Interface(ERC20__factory.abi);

    const data = tokenInterface.encodeFunctionData('approve', [vault.address, MaxUint256]);

    const wrapper = transactor(settingsContext, signer, gasPrice);

    if (wrapper) {
      await wrapper({ to: tokenAddress, data });
      await refetch();
    }
  };

  return (
    <div>
      <div style={{ fontSize: 16 }}>Approve pool tokens</div>
      <div style={{ fontSize: 14, marginBottom: 12, color: 'gray' }}>
        Before performing vault actions, you must first approve the vault to for all pool tokens.
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {poolTokens.map((token) => {
          const allowance = data?.find((allowance) => allowance.address === token.address)?.allowance;
          return (
            <Button
              key={token.address}
              type="primary"
              style={{ marginRight: 8 }}
              disabled={!!allowance && allowance !== '0.0'}
              onClick={(): void => {
                void approve(token.address);
              }}>
              Approve {token.symbol}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
