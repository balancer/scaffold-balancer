import { Input } from 'antd';
import { FC } from 'react';

import { useBalancerInteger } from './BalancerInteger.hook';
import { IBalancerInteger } from './IBalancerInteger';

export const BalancerInteger: FC<IBalancerInteger> = (props) => {
  const { currentValue, handleChange, title } = useBalancerInteger(props);

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input placeholder={title} onChange={handleChange} value={currentValue} />
      </div>
    </div>
  );
};
