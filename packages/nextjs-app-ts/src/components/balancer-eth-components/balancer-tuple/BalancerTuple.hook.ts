import * as _ from 'lodash';
import { ChangeEvent, useContext, useState } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerTuple } from './IBalancerTuple';

export const useBalancerTuple = ({ input, inputIndex }: IBalancerTuple) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);
  const [isRaw, setIsRaw] = useState(false);

  const rawCurrentValue: any = _.get(inputValues, inputIndex);
  let currentValue: string = rawCurrentValue as unknown as string;
  if (!(typeof rawCurrentValue === 'string' || rawCurrentValue instanceof String)) {
    currentValue = JSON.stringify(rawCurrentValue);
  }

  const title = input.name ? `${input.name} (${input.type})` : input.type;

  const onSwitchChange = (isRaw: boolean) => {
    setIsRaw(isRaw);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValues((oldInputValues) => {
      const newInputValues = [...oldInputValues];
      try {
        _.set(newInputValues, inputIndex, JSON.parse(value));
      } catch (err) {
        _.set(newInputValues, inputIndex, value);
      }

      return newInputValues;
    });
  };

  return { currentValue, isRaw, onInputChange, onSwitchChange, title };
};
