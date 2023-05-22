import { CopyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { BaseContract } from 'ethers';
import { FC } from 'react';

import { IBalancerGenericContract } from './IBalancerGenericContract';

import { BalancerFunction } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction';
import { useBalancerGenericContract } from '~~/components/balancer-eth-components/balancer-generic-contract/BalancerGenericContract.hook';

export const BalancerGenericContract: FC<IBalancerGenericContract<BaseContract>> = (props) => {
  const { contract, contractAddress, contractName, copyAddressToClipboard, resetTooltip, tooltipText } =
    useBalancerGenericContract(props);

  return (
    <div className={'balancer-generic-contract-container'}>
      <div className={'balancer-generic-contract-header'}>
        <div className={'balancer-generic-contract-name'}>{contractName}</div>
        <div className={'balancer-generic-contract-address'}>
          {contractAddress}
          <Tooltip title={tooltipText} showArrow={false}>
            <CopyOutlined
              className={'balancer-copy-icon'}
              onClick={copyAddressToClipboard}
              onMouseLeave={resetTooltip}
            />
          </Tooltip>
        </div>
      </div>
      <div className={'balancer-generic-contract-functions'}>
        {Object.keys(contract?.functions || {})
          .filter((functionName) => {
            return functionName.indexOf('(') < 0;
          })
          .map((functionName) => {
            return <BalancerFunction contract={contract} functionName={functionName} key={functionName} />;
          })}
      </div>
    </div>
  );
};
