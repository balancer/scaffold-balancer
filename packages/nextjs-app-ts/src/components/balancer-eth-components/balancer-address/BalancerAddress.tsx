import { Input } from 'antd';
import * as _ from 'lodash';
import { ChangeEvent, FC, useContext, useMemo } from 'react';

import { BalancerFunctionContext } from '../balancer-function/BalancerFunction.context';

import { IBalancerAddress } from './IBalancerAddress';

export const BalancerAddress: FC<IBalancerAddress> = ({ input, inputIndex }) => {
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

  return (
    <div className={'balancer-input-container'}>
      <div className={'balancer-input-title'}>{title}</div>
      <div className={'balancer-input-element'}>
        <Input
          addonBefore={'0x'}
          placeholder={title}
          onChange={handleChange}
          value={valueWithoutPrefix}
          maxLength={42}
        />
      </div>
    </div>
  );
};
