import { FC } from 'react';

import { BalancerArray } from '../balancer-array/BalancerArray';
import { BalancerBaseInput } from '../balancer-base-input/BalancerBaseInput';
import { BalancerTuple } from '../balancer-tuple/BalancerTuple';

import { IBalancerInput } from './IBalancerInput';

export const BalancerInput: FC<IBalancerInput> = ({ input, inputIndex }) => {
  if (input.type.indexOf('[]') >= 0) {
    return <BalancerArray input={input} inputIndex={inputIndex} />;
  } else if (input.type === 'tuple') {
    return <BalancerTuple input={input} inputIndex={inputIndex} />;
  } else {
    return <BalancerBaseInput input={input} inputIndex={inputIndex} />;
  }
};
