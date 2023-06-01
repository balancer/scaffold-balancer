import * as _ from 'lodash';
import { ChangeEvent, useContext, useMemo } from 'react';

import { IBalancerAddress } from '~~/components/balancer-eth-components/balancer-address/IBalancerAddress';
import { BalancerFunctionContext } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction.context';

export const useBalancerAddress = ({ input, inputIndex }: IBalancerAddress) => {
  const { inputValues, setInputValues } = useContext(BalancerFunctionContext);

  const title = input.name ? `${input.name} (${input.type})` : input.type;
  const currentValue = _.get(inputValues, inputIndex) as unknown as string;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;

    // Clear prefix, in case the value was pasted with it.
    let fixedInputValue = inputValue;
    if (inputValue.indexOf('0x') >= 0) {
      fixedInputValue = inputValue.replace('0x', '');
    }

    // Only accept Hex
    const reg = /^[0-9A-Fa-f]*$/;
    if (reg.test(fixedInputValue) || fixedInputValue === '') {
      setInputValues((oldInputValues) => {
        const newInputValues = [...oldInputValues];
        _.set(newInputValues, inputIndex, `0x${fixedInputValue}`);
        return newInputValues;
      });
    }
  };

  // Show the value in the UI without 0x (it's already prefixed in the field)
  const valueWithoutPrefix = useMemo(() => {
    if (!currentValue) return;
    return currentValue.replace('0x', '');
  }, [currentValue]);

  return {
    handleChange,
    title,
    valueWithoutPrefix,
  };
};
