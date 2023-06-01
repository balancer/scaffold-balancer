import { parseEther } from '@ethersproject/units';
import { Button } from 'antd';
import { transactor } from 'eth-components/functions';
import { IEthComponentsSettings } from 'eth-components/models';
import { useBalance } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { IEthersContext } from 'eth-hooks/models';
import React, { FC, useMemo } from 'react';
import { useDebounce } from 'use-debounce';

import { useTxGasPrice } from '../../../nextjs-app-ts/src/modules/pool/hooks/useTxGasPrice';

import { IScaffoldAppProviders } from '~common/models/IScaffoldAppProviders';

/**
 * Is Faucet available?
 * @param scaffoldAppProviders
 * @param ethersAppContext
 * @returns
 */
export const getFaucetAvailable = (
  scaffoldAppProviders: IScaffoldAppProviders,
  ethersAppContext: IEthersContext,
  faucetEnabled: boolean
): boolean => {
  const result =
    (ethersAppContext?.provider &&
      ethersAppContext?.chainId != null &&
      ethersAppContext?.chainId === scaffoldAppProviders.currentTargetNetwork.chainId &&
      scaffoldAppProviders.currentTargetNetwork.name === 'localhost') ??
    false;
  return result && faucetEnabled;
};

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
  faucetEnabled: boolean;
  ethComponentSettings: IEthComponentsSettings;
}

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const ethersAppContext = useEthersAppContext();

  const [yourLocalBalance] = useBalance(ethersAppContext.account ?? '');
  const signer = props.scaffoldAppProviders.localAdaptor?.signer;
  const gasPrice = useTxGasPrice();
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(props.ethComponentSettings, signer, gasPrice, undefined, true);

  /**
   * facuet is only available on localhost
   */
  const isAvailable = getFaucetAvailable(props.scaffoldAppProviders, ethersAppContext, props.faucetEnabled);
  const [faucetAvailable] = useDebounce(isAvailable, 500, {
    trailing: true,
  });

  const faucetHint = useMemo(() => {
    if (faucetAvailable && ethersAppContext?.account != null) {
      return (
        <div style={{ paddingTop: 10, paddingLeft: 10 }}>
          <Button
            type="primary"
            onClick={(): void => {
              if (faucetTx && ethersAppContext?.account != null) {
                faucetTx({
                  to: ethersAppContext?.account,
                  value: parseEther('1').toHexString(),
                }).catch((e) => console.error(e));
              }
            }}>
            💰 Grab funds from the faucet ⛽️
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yourLocalBalance, faucetAvailable, ethersAppContext?.account, faucetTx]);

  return <> {faucetHint} </>;
};
