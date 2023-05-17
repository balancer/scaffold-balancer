import { FC } from 'react';

import { BalancerAddress } from '../balancer-address/BalancerAddress';
import { BalancerBoolean } from '../balancer-boolean/BalancerBoolean';
import { BalancerInteger } from '../balancer-integer/BalancerInteger';
import { BalancerText } from '../balancer-text/BalancerText';

import { IBalancerBaseInput } from './IBalancerBaseInput';

export const BalancerBaseInput: FC<IBalancerBaseInput> = ({ input, inputIndex }) => {
  if (input.type === 'string') {
    return <BalancerText input={input} inputIndex={inputIndex} />;
  } else if (input.type === 'address') {
    return <BalancerAddress input={input} inputIndex={inputIndex} />;
  } else if (input.type === 'uint256') {
    return <BalancerInteger input={input} inputIndex={inputIndex} />;
  } else if (input.type === 'bool') {
    return <BalancerBoolean input={input} inputIndex={inputIndex} />;
  } else {
  }

  return (
    <>
      {input.name ? `${input.name} (${input.type})` : input.type}
      <br />
    </>
  );
};
