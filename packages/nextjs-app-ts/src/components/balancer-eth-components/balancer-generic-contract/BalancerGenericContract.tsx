import { BaseContract } from 'ethers';
import { FC } from 'react';

import { IBalancerGenericContract } from './IBalancerGenericContract';

import { BalancerFunction } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction';

export const BalancerGenericContract: FC<IBalancerGenericContract<BaseContract>> = ({ contract, contractName }) => {
  // Todo remove this (Only debugging purposes)
  console.log(contract);

  return (
    <div className={'balancer-generic-contract-container'}>
      <div className={'balancer-generic-contract-header'}>{contractName}</div>
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
