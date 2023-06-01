import * as _ from 'lodash';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerArray } from './IBalancerArray';

export const useBalancerArray = ({ input, inputIndex }: IBalancerArray) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);

  const [isRaw, setIsRaw] = useState(false);
  const [numberArrayElements, setNumberArrayElements] = useState(0);

  const rawCurrentValue: any = _.get(inputValues, inputIndex);
  let currentValue: string = rawCurrentValue as unknown as string;
  if (!(typeof rawCurrentValue === 'string' || rawCurrentValue instanceof String)) {
    currentValue = JSON.stringify(rawCurrentValue);
  }
  const elementsArray = Array.from(Array(numberArrayElements).keys());
  const title = input.name ? `${input.name} (${input.type})` : input.type;

  useEffect(() => {
    if (rawCurrentValue && rawCurrentValue.length && numberArrayElements === 0) {
      setNumberArrayElements(rawCurrentValue.length);
    }
  }, [rawCurrentValue, isRaw]);

  const onAddClick = () => {
    setNumberArrayElements((old) => old + 1);
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

  const onRemoveClick = () => {
    setInputValues((oldInputValues) => {
      const newInputValues = [...oldInputValues];
      const valuesArray = _.get(newInputValues, inputIndex) as unknown as any[];
      if (valuesArray && valuesArray.length >= numberArrayElements) {
        valuesArray.pop();
      }
      _.set(newInputValues, inputIndex, valuesArray);
      return newInputValues;
    });
    setNumberArrayElements((old) => (old <= 0 ? 0 : old - 1));
  };

  const onSwitchChange = (isRaw: boolean) => {
    setIsRaw(isRaw);
  };

  return { currentValue, elementsArray, isRaw, onAddClick, onInputChange, onRemoveClick, onSwitchChange, title };
};
