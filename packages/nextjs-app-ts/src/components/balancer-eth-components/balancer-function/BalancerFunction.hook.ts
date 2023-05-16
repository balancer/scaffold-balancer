import { BaseContract } from 'ethers';
import { useEffect, useState } from 'react';

import { getButtonText, getContractFunctionInterface, hasInput, isReadFunction } from './BalancerFunction.helpers';
import { IBalancerFunction } from './IBalancerFunction';

export const useBalancerFunction = ({ contract, functionName }: IBalancerFunction<BaseContract>) => {
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

  return {
    buttonText: getButtonText(contractFunctionInterface),
    functionValue,
    inputs,
  };
};
