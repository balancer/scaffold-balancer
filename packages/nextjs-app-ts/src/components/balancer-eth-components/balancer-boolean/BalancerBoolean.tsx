import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import * as _ from 'lodash';
import { FC, useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerBoolean } from './IBalancerBoolean';

export const BalancerBoolean: FC<IBalancerBoolean> = ({ input, inputIndex }) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);

  const title = input.name ? `${input.name} (${input.type})` : input.type;
  const currentValue = _.get(inputValues, inputIndex) as unknown as boolean;

  const onInputChange = (event: CheckboxChangeEvent) => {
    const value = event.target.checked;
    setInputValues((oldInputValues) => {
      const newInputValues = [...oldInputValues];
      _.set(newInputValues, inputIndex, value);
      return newInputValues;
    });
  };

  console.log('Here!');

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
