import { Checkbox } from 'antd';
import { FC } from 'react';

import { useBalancerBoolean } from './BalancerBoolean.hook';
import { IBalancerBoolean } from './IBalancerBoolean';

export const BalancerBoolean: FC<IBalancerBoolean> = (props) => {
  const { input } = props;
  const { currentValue, onInputChange, title } = useBalancerBoolean(props);

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element-boolean'}>
        <Checkbox onChange={onInputChange} value={currentValue}>
          {input.name}
        </Checkbox>
      </div>
    </div>
  );
};
