import { Input } from 'antd';
import { FC } from 'react';

import { IBalancerText } from './IBalancerText';

import { useBalancerText } from '~~/components/balancer-eth-components/balancer-text/BalancerText.hook';

export const BalancerText: FC<IBalancerText> = (props) => {
  const { currentValue, onInputChange, title } = useBalancerText(props);

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input placeholder={title} onChange={onInputChange} value={currentValue} />
      </div>
    </div>
  );
};
