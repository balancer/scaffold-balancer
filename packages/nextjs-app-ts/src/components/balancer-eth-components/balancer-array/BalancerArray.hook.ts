import * as _ from 'lodash';
import { useContext, useState } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerArray } from './IBalancerArray';

export const useBalancerArray = ({ input, inputIndex }: IBalancerArray) => {
  const { setInputValues } = useContext(BalancerFunctionContext);

  const [numberArrayElements, setNumberArrayElements] = useState(0);

  const title = input.name ? `${input.name} (${input.type})` : input.type;
  const elementsArray = Array.from(Array(numberArrayElements).keys());

  const onAddClick = () => {
    setNumberArrayElements((old) => old + 1);
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

  return { elementsArray, onRemoveClick, onAddClick, title };
};
