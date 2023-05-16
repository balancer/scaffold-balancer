import { FC } from 'react';

import { BalancerInput } from '../balancer-input/BalancerInput';

import { IBalancerTuple } from './IBalancerTuple';

export const BalancerTuple: FC<IBalancerTuple> = ({ input, inputIndex }) => {
  return (
    <>
      <p className={'balancer-tuple-title'}>{input.name ? `${input.name} (${input.type})` : input.type}</p>
      <div className={'balancer-tuple-inputs-container'}>
        {input.components.map((inputComponent, inputComponentIndex) => (
          <div className={'balancer-tuple-input'} key={inputComponent.name}>
            <BalancerInput input={inputComponent} inputIndex={[...inputIndex, inputComponentIndex]} />
          </div>
        ))}
      </div>
    </>
  );
};
