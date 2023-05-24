import { Button, Input } from 'antd';
import { FC } from 'react';

import { useBalancerInteger } from './BalancerInteger.hook';
import { IBalancerInteger } from './IBalancerInteger';

const zeroesButtons = [18, 8, 6];

export const BalancerInteger: FC<IBalancerInteger> = (props) => {
  const { addZeroes, currentValue, handleChange, title } = useBalancerInteger(props);

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>
        {title}
        {zeroesButtons.map((numberOfZeroes) => {
          return (
            <Button
              key={numberOfZeroes}
              type={'primary'}
              size={'small'}
              className={'balancer-zero-button'}
              onClick={() => addZeroes(numberOfZeroes)}>
              1e{numberOfZeroes}
            </Button>
          );
        })}
      </div>
      <div className={'balancer-input-element'}>
        <Input placeholder={title} onChange={handleChange} value={currentValue} />
      </div>
    </div>
  );
};
