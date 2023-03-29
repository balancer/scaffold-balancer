import { Select } from 'antd';
import { IEthersContext } from 'eth-hooks/context';
import { FC, useState } from 'react';

import { IScaffoldAppProviders } from '~common/models';
import { ExampleController } from '~~/modules/mpc-examples/ExampleController';

export const MpcExamples: FC<IMpcExamples> = ({ ethersAppContext, scaffoldAppProviders }) => {
  const [selectedExample, setSelectedExample] = useState<IExampleContract>();

  const exampleContracts = [
    {
      controllerContract: 'NullController',
      controllerFactoryContract: 'NullControllerFactory',
    },
  ];

  const selectOptions = exampleContracts.map((contract) => ({
    value: contract.controllerContract,
    label: contract.controllerContract,
  }));

  const handleChange = (value: string) => {
    const selectedContract = exampleContracts.find((contract) => contract.controllerContract === value);
    if (selectedContract) {
      setSelectedExample(selectedContract);
    }
  };

  return (
    <div className={'mpc-examples-container'}>
      <div className={'choose-controller-container'}>
        <div className={'spacer'} />
        <div className={'choose-controller'}>
          <div className={'choose-controller-title'}>Choose a controller: </div>
          <div className={'choose-controller-dropdown'}>
            <Select defaultValue="" style={{ width: 300 }} onChange={handleChange} options={selectOptions} />
          </div>
        </div>
        <div className={'spacer'} />
      </div>
      <div className={'mpc-examples-page'}>
        <div className={'spacer'} />
        {selectedExample && (
          <ExampleController
            controllerContractName={selectedExample?.controllerContract}
            controllerFactoryContractName={selectedExample?.controllerFactoryContract}
            ethersAppContext={ethersAppContext}
            scaffoldAppProviders={scaffoldAppProviders}
          />
        )}
        <div className={'spacer'} />
      </div>
    </div>
  );
};

interface IMpcExamples {
  ethersAppContext: IEthersContext;
  scaffoldAppProviders: IScaffoldAppProviders;
}

interface IExampleContract {
  controllerContract: string;
  controllerFactoryContract: string;
}
