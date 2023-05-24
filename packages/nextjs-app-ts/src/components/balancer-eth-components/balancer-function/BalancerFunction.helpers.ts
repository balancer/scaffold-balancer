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

const exportJsonFromText = ({
  firstChar = 0,
  text,
}: {
  firstChar: number;
  text: string;
}): {
  jsonObject: any;
  jsonBegin: number;
  jsonEnd: number;
} => {
  const jsonBegin = text.indexOf('{', firstChar);
  if (jsonBegin < 0) {
    return {
      jsonObject: undefined,
      jsonBegin: -1,
      jsonEnd: -1,
    };
  }
  let jsonEnd = 0;
  let openedBrackets = 1;
  for (let i = jsonBegin + 1; i < text.length; i++) {
    const currentChar = text.charAt(i);
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
  return {
    jsonObject: JSON.parse(text.substring(jsonBegin, jsonEnd)),
    jsonBegin,
    jsonEnd,
  };
};

const exportJsonListFromText = (text: string) => {
  const jsonList = [];
  for (let firstChar = 0; firstChar < text.length; firstChar++) {
    const { jsonObject, jsonEnd } = exportJsonFromText({ firstChar, text });
    if (jsonEnd === -1) {
      break;
    }
    firstChar = jsonEnd;
    jsonList.push(jsonObject);
  }
  return jsonList;
};

export const extractErrorReasonFromError = (errorObject: any) => {
  const rawErrorMessage = errorObject.message as string;
  const jsonList = exportJsonListFromText(rawErrorMessage);

  for (let i = 0; i < jsonList.length; i++) {
    const jsonObject = jsonList[i];
    if (jsonObject.reason) {
      return jsonObject.reason;
    } else if (jsonObject.message === 'Internal JSON-RPC error.') {
      return jsonObject.data.message;
    }
  }

  console.log(errorObject);
  return 'Check console for error details.';
};
