import { FC } from 'react';

import { IBalancerBaseInput } from './IBalancerBaseInput';

export const BalancerBaseInput: FC<IBalancerBaseInput> = ({ input, inputIndex }) => {
  if (input.type === 'string') {
  } else if (input.type === 'address') {
  } else if (input.type === 'uint256') {
  } else if (input.type === 'bool') {
  } else {
  }

  return (
    <>
      {input.name ? `${input.name} (${input.type})` : input.type}
      <br />
    </>
  );
};
