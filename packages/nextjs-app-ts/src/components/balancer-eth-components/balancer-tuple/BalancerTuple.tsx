import { Input, Switch } from 'antd';
import { FC } from 'react';

import { BalancerInput } from '../balancer-input/BalancerInput';

import { useBalancerTuple } from './BalancerTuple.hook';
import { IBalancerTuple } from './IBalancerTuple';

export const BalancerTuple: FC<IBalancerTuple> = (props) => {
  const { input, inputIndex } = props;
  const { currentValue, isRaw, onInputChange, onSwitchChange, title } = useBalancerTuple(props);

  return (
    <>
      <p className={'balancer-tuple-title'}>
        {title}
        <Switch checkedChildren={'raw'} unCheckedChildren={'full'} checked={isRaw} onChange={onSwitchChange} />
      </p>
      {!isRaw && (
        <div className={'balancer-tuple-inputs-container'}>
          {input.components.map((inputComponent, inputComponentIndex) => (
            <div className={'balancer-tuple-input'} key={inputComponent.name}>
              <BalancerInput input={inputComponent} inputIndex={[...inputIndex, inputComponentIndex]} />
            </div>
          ))}
        </div>
      )}
      {isRaw && <Input placeholder={title} onChange={onInputChange} value={currentValue} />}
    </>
  );
};
