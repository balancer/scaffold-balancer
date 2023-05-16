import { Button, Collapse } from 'antd';
import { BaseContract } from 'ethers';
import { FC, useContext, useState } from 'react';

import { useBalancerFunction } from '../balancer-function/BalancerFunction.hook';
import { BalancerInput } from '../balancer-input/BalancerInput';

import { BalancerFunctionContext } from './BalancerFunction.context';
import { IBalancerFunction } from './IBalancerFunction';

const { Panel } = Collapse;

const BalancerFunctionWithContext: FC<IBalancerFunction<BaseContract>> = ({ contract, functionName }) => {
  const { buttonText, functionValue, inputs } = useBalancerFunction({ contract, functionName });

  const { inputValues } = useContext(BalancerFunctionContext);

  return (
    <Collapse>
      <Panel header={functionName} key={functionName}>
        <div className={'balancer-function-container'}>
          <div className={'balancer-function-inputs-container'}>
            {inputs?.map((input, index) => (
              <BalancerInput input={input} inputIndex={[index]} key={input.name} />
            ))}
          </div>
          <div className={'balancer-function-button-container'}>
            <Button type={'primary'}>{buttonText}</Button>
          </div>
          <div className={'balancer-function-value-container'}>
            <p>
              {functionValue} {inputValues}
            </p>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};

export const BalancerFunction: FC<IBalancerFunction<BaseContract>> = ({ contract, functionName }) => {
  const [inputValues, setInputValues] = useState<any[]>([]);

  return (
    <BalancerFunctionContext.Provider value={{ inputValues, setInputValues }}>
      <BalancerFunctionWithContext contract={contract} functionName={functionName} />
    </BalancerFunctionContext.Provider>
  );
};
