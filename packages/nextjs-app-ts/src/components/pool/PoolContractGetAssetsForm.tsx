import { Button, Input, Select } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { Interface, parseUnits } from 'ethers/lib/utils';
import React, { FC, useContext, useState } from 'react';

import { ERC20__factory } from '~common/generated/contract-types';
import { useTokenBalances } from '~~/components/pool/hooks/useTokenBalances';
import { PoolToken } from '~~/components/pool/pool-types';

interface Props {
  poolTokens: PoolToken[];
}

export const PoolContractGetAssetsForm: FC<Props> = ({ poolTokens }) => {
  const { data: poolTokensWithUserBalance, refetch } = useTokenBalances(poolTokens);
  const settingsContext = useContext(EthComponentsSettingsContext);
  const [token, setToken] = useState<string | null>(null);
  const [addressToSnatchFrom, setAddressToSnatchFrom] = useState<string>('');
  const [amountToSnatch, setAmountToSnatch] = useState<string>('');
  const { provider, account } = useEthersAppContext();

  const snatch = async (): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [addressToSnatchFrom]);
    const signer = provider?.getSigner(addressToSnatchFrom);
    const tokenInterface = new Interface(ERC20__factory.abi);

    const data = tokenInterface.encodeFunctionData('transfer', [account, parseUnits(amountToSnatch, 18)]);

    // TODO: do proper gas estimations
    const wrapper = transactor(settingsContext, signer, 16298033250);

    if (wrapper) {
      await wrapper({ to: token || '', data });
      await refetch();
    }
  };

  return (
    <div>
      <div style={{ fontSize: 16 }}>Snatch pool tokens</div>
      <div style={{ fontSize: 14, marginBottom: 12, color: 'gray' }}>
        If you do not have the appropriate tokens for this pool, you can snatch them from any holder. Since we
        impersonate the account, it must also have enough ETH to pay for the tx cost. Holders:{' '}
        {poolTokens.map((token) => (
          <a
            href={`https://etherscan.io/token/${token.address}#balances`}
            key={token.address}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: 4 }}>
            {token.symbol}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          showArrow={true}
          defaultActiveFirstOption={false}
          filterOption={false}
          labelInValue={false}
          id="token"
          value={token}
          onChange={(e): void => {
            setToken(e);
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
        <Input
          value={addressToSnatchFrom}
          onChange={(e): void => {
            setAddressToSnatchFrom(e.target.value);
          }}
          placeholder={'Address to snatch from'}
          style={{ marginRight: 12 }}
        />
        <Input
          value={amountToSnatch}
          onChange={(e): void => {
            setAmountToSnatch(e.target.value);
          }}
          placeholder={'Human amount ie: 10.0 = 10 WETH'}
          style={{ marginRight: 12 }}
        />
        <Button
          type="primary"
          onClick={(): void => {
            void snatch();
          }}>
          Snatch
        </Button>
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={{ marginRight: 4 }}> Your balance: </span>
        {poolTokensWithUserBalance?.map((token, index) => (
          <span key={token.address} style={{ paddingRight: 2 }}>
            {token.userBalance} {token.symbol}
            {index < poolTokensWithUserBalance.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
