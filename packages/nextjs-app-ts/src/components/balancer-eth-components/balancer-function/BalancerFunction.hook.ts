import { BaseContract } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { BalancerFunctionContext } from './BalancerFunction.context';
import {
  extractErrorReasonFromError,
  getButtonText,
  getContractFunctionInterface,
  hasInput,
  isReadFunction,
} from './BalancerFunction.helpers';
import { IBalancerFunction } from './IBalancerFunction';

export const useBalancerFunction = ({ contract, functionName }: IBalancerFunction<BaseContract>) => {
  const { inputValues } = useContext(BalancerFunctionContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [functionValue, setFunctionValue] = useState('');

  const contractFunction = contract?.functions[functionName];
  const contractFunctionInterface = getContractFunctionInterface({ contract, functionName });
  const inputs = contractFunctionInterface?.inputs;

  useEffect(() => {
    const loadFunctionValue = async () => {
      if (!contractFunction) return;
      if (!contractFunctionInterface) return;
      if (isReadFunction(contractFunctionInterface) && !hasInput(contractFunctionInterface)) {
        setFunctionValue(await contractFunction());
      }
    };
    loadFunctionValue().catch((err) => console.log(err));
  }, [contractFunction, contractFunctionInterface]);

  const onButtonClick = async () => {
    if (!contractFunction) return;
    try {
      setErrorMessage('');
      return setFunctionValue(await contractFunction(...inputValues));
    } catch (e) {
      setErrorMessage(extractErrorReasonFromError(e));
    }
  };

  return {
    buttonText: getButtonText(contractFunctionInterface),
    errorMessage,
    functionValue,
    inputs,
    onButtonClick,
  };
};
