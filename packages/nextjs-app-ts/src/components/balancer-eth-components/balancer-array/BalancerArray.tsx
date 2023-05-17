import { ParamType } from '@ethersproject/abi';
import { Button } from 'antd';
import * as _ from 'lodash';
import { FC, useContext, useState } from 'react';

import { BalancerInput } from '../balancer-input/BalancerInput';

import { IBalancerArray } from './IBalancerArray';

import { BalancerFunctionContext } from '~~/components/balancer-eth-components/balancer-function/BalancerFunction.context';

export const BalancerArray: FC<IBalancerArray> = ({ input, inputIndex }) => {
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

  return (
    <div className={'balancer-array-container'}>
      <div className={'balancer-array-title'}>{title}</div>
      <div className={'balancer-array-body'}>
        {elementsArray.map((_, index) => {
          const fieldTitle = `#${index}`;
          const elementInput: ParamType = {
            name: fieldTitle,
            type: input.type.replace('[]', ''),
            baseType: '',
            indexed: false,
            components: [],
            arrayLength: 0,
            arrayChildren: input.arrayChildren,
            _isParamType: true,
            format: input.format,
          };

          return (
            <div className={'balancer-array-input'} key={fieldTitle}>
              <BalancerInput input={elementInput} inputIndex={[...inputIndex, index]} />
            </div>
          );
        })}
        <Button type={'primary'} onClick={onRemoveClick} className={'balancer-array-button'}>
          -
        </Button>
        <Button type={'primary'} onClick={onAddClick} className={'balancer-array-button'}>
          +
        </Button>
      </div>
    </div>
  );
};
