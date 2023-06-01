import * as _ from 'lodash';
import { ChangeEvent, useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerText } from './IBalancerText';

export const useBalancerText = ({ input, inputIndex }: IBalancerText) => {
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

  return { currentValue, onInputChange, title };
};
