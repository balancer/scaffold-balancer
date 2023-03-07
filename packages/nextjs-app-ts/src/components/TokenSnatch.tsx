import { Button, Input, Select, Typography } from 'antd';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersAppContext } from 'eth-hooks/context';
import { Interface, parseUnits } from 'ethers/lib/utils';
import React, { FC, useContext, useState } from 'react';

import { getNetworkInfo } from '~common/functions';
import { ERC20__factory } from '~common/generated/contract-types';
import { MinimalToken } from '~~/helpers/global-types';
import { useTokenBalances } from '~~/hooks/useTokenBalances';
import { useTxGasPrice } from '~~/modules/pool/hooks/useTxGasPrice';

interface Props {
  tokens: MinimalToken[];
}

export const TokenSnatch: FC<Props> = ({ tokens }) => {
  const { data: tokensWithUserBalances, refetch } = useTokenBalances(tokens);
  const settingsContext = useContext(EthComponentsSettingsContext);

  const [token, setToken] = useState<string | null>(null);
  const [addressToSnatchFrom, setAddressToSnatchFrom] = useState<string>('');
  const [amountToSnatch, setAmountToSnatch] = useState<string>('');
  const { provider, account, chainId } = useEthersAppContext();
  const networkInfo = getNetworkInfo(chainId);
  const gasPrice = useTxGasPrice();

  const snatch = async (): Promise<void> => {
    await provider?.send('hardhat_impersonateAccount', [addressToSnatchFrom]);
    const signer = provider?.getSigner(addressToSnatchFrom);
    const tokenInterface = new Interface(ERC20__factory.abi);

    const data = tokenInterface.encodeFunctionData('transfer', [account, parseUnits(amountToSnatch, 18)]);

    const wrapper = transactor(settingsContext, signer, gasPrice);

    if (wrapper) {
      await wrapper({ to: token || '', data });
      await refetch();
    }
  };

  return (
    <div>
      <Typography.Paragraph style={{ color: 'gray', marginBottom: 12 }}>
        If you do not have the appropriate tokens, you can snatch them from any holder. Since we impersonate the
        account, it must also have enough ETH to pay for the tx cost. Holders:{' '}
        {tokens.map((token) => (
          <a
            href={`${networkInfo?.blockExplorer}token/${token.address}#balances`}
            key={token.address}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: 4 }}>
            {token.symbol}
          </a>
        ))}
      </Typography.Paragraph>

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
          {tokens.map((token) => (
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
        {tokensWithUserBalances?.map((token, index) => (
          <span key={token.address} style={{ paddingRight: 2 }}>
            {token.userBalance} {token.symbol}
            {index < tokensWithUserBalances.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
