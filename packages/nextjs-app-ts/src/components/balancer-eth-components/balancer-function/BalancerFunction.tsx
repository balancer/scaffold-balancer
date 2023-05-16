import { Button, Collapse } from 'antd';
import { BaseContract } from 'ethers';
import { FC } from 'react';

import { IBalancerFunction } from './IBalancerFunction';

import { useBalancerFunction } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction.hook';

const { Panel } = Collapse;

export const BalancerFunction: FC<IBalancerFunction<BaseContract>> = ({ contract, functionName }) => {
  const { buttonText, functionValue } = useBalancerFunction({ contract, functionName });

  return (
    <Collapse size="small">
      <Panel header={functionName} key={functionName}>
        <div className={'balancer-function-container'}>
          <div className={'balancer-function-inputs-container'}></div>
          <div className={'balancer-function-button-container'}>
            <Button type={'primary'}>{buttonText}</Button>
          </div>
          <div className={'balancer-function-value-container'}>
            <p>{functionValue}</p>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};
