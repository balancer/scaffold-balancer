import { Input } from 'antd';
import * as _ from 'lodash';
import { ChangeEvent, FC, useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerInteger } from './IBalancerInteger';

export const BalancerInteger: FC<IBalancerInteger> = ({ input, inputIndex }) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);

  const title = input.name ? `${input.name} (${input.type})` : input.type;
  const currentValue = _.get(inputValues, inputIndex) as unknown as number;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    // Only accept digits
    const reg = /^[0-9]*$/;
    if (reg.test(inputValue) || inputValue === '') {
      setInputValues((oldInputValues) => {
        const newInputValues = [...oldInputValues];
        _.set(newInputValues, inputIndex, parseInt(inputValue));
        return newInputValues;
      });
    }
  };

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input placeholder={title} onChange={handleChange} value={currentValue} />
      </div>
    </div>
  );
};
