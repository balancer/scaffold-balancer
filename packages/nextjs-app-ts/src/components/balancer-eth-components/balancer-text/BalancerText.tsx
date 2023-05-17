import { Input } from 'antd';
import * as _ from 'lodash';
import { ChangeEvent, FC, useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerText } from './IBalancerText';

export const BalancerText: FC<IBalancerText> = ({ input, inputIndex }) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);

  const title = input.name ? `${input.name} (${input.type})` : input.type;
  const currentValue = _.get(inputValues, inputIndex) as unknown as string;

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValues((oldInputValues) => {
      const newInputValues = [...oldInputValues];
      _.set(newInputValues, inputIndex, value);
      return newInputValues;
    });
  };

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input placeholder={title} onChange={onInputChange} value={currentValue} />
      </div>
    </div>
  );
};
