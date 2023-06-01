import { ParamType } from '@ethersproject/abi';
import { Button, Input, Switch } from 'antd';
import { FC } from 'react';

import { BalancerInput } from '../balancer-input/BalancerInput';

import { useBalancerArray } from './BalancerArray.hook';
import { IBalancerArray } from './IBalancerArray';

export const BalancerArray: FC<IBalancerArray> = (props) => {
  const { input, inputIndex } = props;
  const { currentValue, elementsArray, isRaw, onAddClick, onInputChange, onRemoveClick, onSwitchChange, title } =
    useBalancerArray(props);

  return (
    <div className={'balancer-array-container'}>
      <div className={'balancer-array-title'}>
        {title}
        <Switch checkedChildren={'raw'} unCheckedChildren={'full'} checked={isRaw} onChange={onSwitchChange} />
      </div>
      {!isRaw && (
        <div className={'balancer-array-body'}>
          {elementsArray.map((_, index) => {
            const fieldTitle = `#${index}`;
            const elementInput: ParamType = {
              name: fieldTitle,
              type: input.type.replace('[]', ''),
              baseType: '',
              indexed: false,
              components: [],
              arrayLength: 0,
              arrayChildren: input.arrayChildren,
              _isParamType: true,
              format: input.format,
            };

            return (
              <div className={'balancer-array-input'} key={fieldTitle}>
                <BalancerInput input={elementInput} inputIndex={[...inputIndex, index]} />
              </div>
            );
          })}
          <Button type={'primary'} danger={true} onClick={onRemoveClick} className={'balancer-array-button'}>
            -
          </Button>
          <Button type={'primary'} onClick={onAddClick} className={'balancer-array-button'}>
            +
          </Button>
        </div>
      )}
      {isRaw && <Input placeholder={title} onChange={onInputChange} value={currentValue} />}
    </div>
  );
};
