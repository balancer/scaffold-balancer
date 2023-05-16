import { BaseContract } from 'ethers';
import { FC } from 'react';

import { IBalancerGenericContract } from './IBalancerGenericContract';

import { BalancerFunction } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction';

export const BalancerGenericContract: FC<IBalancerGenericContract<BaseContract>> = ({ contract }) => {
  console.log(contract);

  return (
    <>
      {Object.keys(contract?.functions || {})
        .filter((functionName) => {
          return functionName.indexOf('(') < 0;
        })
        .map((functionName) => {
          return <BalancerFunction contract={contract} functionName={functionName} key={functionName} />;
        })}
    </>
  );
};
