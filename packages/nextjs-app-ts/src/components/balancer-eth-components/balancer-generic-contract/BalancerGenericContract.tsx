import { BaseContract } from 'ethers';
import { FC } from 'react';

import { IBalancerGenericContract } from './IBalancerGenericContract';

import { BalancerCopyIcon } from '~~/components/balancer-eth-components/balancer-copy-icon/BalancerCopyIcon';
import { BalancerFunction } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction';

export const BalancerGenericContract: FC<IBalancerGenericContract<BaseContract>> = ({ contract, contractName }) => {
  // Todo remove this (Only debugging purposes)
  console.log(contract);

  const contractAddress = contract?.address;

  return (
    <div className={'balancer-generic-contract-container'}>
      <div className={'balancer-generic-contract-header'}>
        <div className={'balancer-generic-contract-name'}>{contractName}</div>
        <div className={'balancer-generic-contract-address'}>
          {contractAddress}
          <BalancerCopyIcon textToCopy={contractAddress || ''} />
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
