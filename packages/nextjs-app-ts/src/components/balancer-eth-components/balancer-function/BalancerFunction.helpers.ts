import { FunctionFragment } from '@ethersproject/abi';
import { BaseContract } from 'ethers';

import { IBalancerFunction } from './IBalancerFunction';

export const getContractFunctionInterface = ({ contract, functionName }: IBalancerFunction<BaseContract>) => {
  const contractFunctionSignature = Object.keys(contract?.interface.functions).filter(
    (functionSignature) => functionSignature.indexOf(functionName) >= 0
  )[0];
  return contract?.interface.functions[contractFunctionSignature];
};

export const isReadFunction = (contractFunctionInterface: FunctionFragment | undefined): boolean => {
  return !!contractFunctionInterface && ['view', 'pure'].indexOf(contractFunctionInterface?.stateMutability) >= 0;
};

export const hasInput = (contractFunctionInterface: FunctionFragment | undefined): boolean => {
  return !!contractFunctionInterface && contractFunctionInterface?.inputs.length > 0;
};

export const getButtonText = (contractFunctionInterface: FunctionFragment | undefined): string => {
  if (!contractFunctionInterface) return '';
  if (isReadFunction(contractFunctionInterface)) return hasInput(contractFunctionInterface) ? 'Query' : 'Refresh';
  return 'Write';
};

export const extractErrorReasonFromMessage = (rawErrorMessage: string) => {
  const jsonBegin = rawErrorMessage.indexOf('{');
  let jsonEnd = 0;
  let openedBrackets = 1;
  for (let i = jsonBegin + 1; i < rawErrorMessage.length; i++) {
    const currentChar = rawErrorMessage.charAt(i);
    if (currentChar === '{') {
      openedBrackets++;
    } else if (currentChar === '}') {
      openedBrackets--;
    }
    if (openedBrackets <= 0) {
      jsonEnd = i + 1;
      break;
    }
  }
  const jsonMessage: { reason: string } = JSON.parse(rawErrorMessage.substring(jsonBegin, jsonEnd)) as {
    reason: string;
  };
  return jsonMessage.reason;
};
