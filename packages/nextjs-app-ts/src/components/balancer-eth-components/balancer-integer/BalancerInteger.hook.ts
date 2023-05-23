import * as _ from 'lodash';
import { ChangeEvent, useContext } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerInteger } from '~~/components/balancer-eth-components/balancer-integer/IBalancerInteger';

export const useBalancerInteger = ({ input, inputIndex }: IBalancerInteger) => {
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
        _.set(newInputValues, inputIndex, inputValue);
        return newInputValues;
      });
    }
  };

  return { currentValue, handleChange, title };
};
