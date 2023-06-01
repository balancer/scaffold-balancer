import { createContext, Dispatch, SetStateAction } from 'react';

export const BalancerFunctionContext = createContext<IBalancerFunctionContext>({
  inputValues: [],
  setInputValues: () => undefined,
});

interface IBalancerFunctionContext {
  inputValues: any[];
  setInputValues: Dispatch<SetStateAction<any[]>>;
}
