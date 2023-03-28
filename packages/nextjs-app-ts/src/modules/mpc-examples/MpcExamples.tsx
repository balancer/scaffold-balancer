import {FC, useMemo, useState} from "react";
import { GenericContract } from "eth-components/ant"
import { IEthersContext } from 'eth-hooks/context';
import { useEventListener } from 'eth-hooks';
import { cloneDeep } from 'lodash';

import { IScaffoldAppProviders } from '~common/models';
import { useAppContracts } from '~common/components/context';
import {ExampleController} from "~~/modules/mpc-examples/ExampleController";

export const MpcExamples: FC<IMpcExamples> = ({
  ethersAppContext,
  scaffoldAppProviders
}) => {
  const [selectedExample, setSelectedExample] = useState<IExampleContract>()

  const exampleContracts = [{
    controllerContract: 'NullController',
    controllerFactoryContract: 'NullControllerFactory'
  }]

  const selectContract = (selectedContract: IExampleContract) => () => {
    setSelectedExample(selectedContract);
  }

  return <div className={'mpc-examples-container'}>
    <div className={'examples-menu'}>
      {exampleContracts.map(contract => <button onClick={selectContract(contract)}>{contract.controllerContract}</button>)}
    </div>
    <div className={'examples-page'}>
      {selectedExample && <ExampleController
        controllerContractName={selectedExample?.controllerContract}
        controllerFactoryContractName={selectedExample?.controllerFactoryContract}
        ethersAppContext={ethersAppContext}
        scaffoldAppProviders={scaffoldAppProviders}
      />}
    </div>
  </div>;
}

interface IMpcExamples {
  ethersAppContext: IEthersContext;
  scaffoldAppProviders: IScaffoldAppProviders;
}

interface IExampleContract {
  controllerContract: string,
  controllerFactoryContract: string
}