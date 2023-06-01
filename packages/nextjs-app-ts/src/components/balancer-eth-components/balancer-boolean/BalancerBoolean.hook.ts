import { CheckboxChangeEvent } from 'antd/es/checkbox';
import * as _ from 'lodash';
import { useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerBoolean } from './IBalancerBoolean';

export const useBalancerBoolean = ({ input, inputIndex }: IBalancerBoolean) => {
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

  return { currentValue, onInputChange, title };
};
