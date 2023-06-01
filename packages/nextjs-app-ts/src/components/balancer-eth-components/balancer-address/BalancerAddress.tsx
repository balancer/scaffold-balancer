import { Input } from 'antd';
import { FC } from 'react';

import { useBalancerAddress } from './BalancerAddress.hook';
import { IBalancerAddress } from './IBalancerAddress';

export const BalancerAddress: FC<IBalancerAddress> = (props) => {
  const { handleChange, title, valueWithoutPrefix } = useBalancerAddress(props);

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input
          addonBefore={'0x'}
          placeholder={title}
          onChange={handleChange}
          value={valueWithoutPrefix}
          maxLength={42}
        />
      </div>
    </div>
  );
};
