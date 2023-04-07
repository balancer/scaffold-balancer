import { Button, Select } from 'antd';
import { GenericContract } from 'eth-components/ant';
import { useEventListener } from 'eth-hooks';
import { IEthersContext } from 'eth-hooks/context';
import { cloneDeep } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';

import { useAppContracts, useContractsAppStore } from '~common/components/context';
import { IScaffoldAppProviders } from '~common/models';

export const ExampleController: FC<IExampleController> = ({
  controllerContractName,
  controllerFactoryContractName,
  ethersAppContext,
  scaffoldAppProviders,
}) => {
  const store = useContractsAppStore();
  const { chainId, signer } = ethersAppContext;
  const [chosenContract, setChosenContract] = useState();
  const [chosenControllerAddress, setChosenControllerAddress] = useState();

  const [updateStore, setUpdateStore] = useState(false);

  const exampleControllerContract = useAppContracts(controllerContractName, ethersAppContext.chainId);
  const exampleControllerFactoryContract = useAppContracts(controllerFactoryContractName, ethersAppContext.chainId);

  const exampleControllerFactoryAddress = exampleControllerFactoryContract?.address;
  const events = useEventListener(exampleControllerFactoryContract, 'ControllerCreated');
  const exampleControllerAddresses = useMemo(() => {
    return events[0].map((event) => {
      const data = event.data;
      const topics = event.topics;
      const decodedData = event.decode(data, topics);
      return decodedData.controller;
    });
  }, [events?.[0]?.length]);

  useEffect(() => {
    if (!chosenControllerAddress) return;

    const newState = cloneDeep(store.contractState);
    const contractNames = Object.keys(newState.contractConnectors);

    // Refreshing all contracts, since cloneDeep removes event listeners
    for (const contractName of contractNames) {
      const contractAddress = newState.contractConnectors[contractName].config[chainId].address;
      const newContract = newState.contractConnectors[contractName].connect(contractAddress, signer);
      newState.contractsByName[contractName][chainId] = newContract;
    }

    // Recreating controller contract with selected address, to show correct information and call the
    // correct contract in the frontend
    const newControllerContract = newState.contractConnectors[controllerContractName].connect(
      chosenControllerAddress,
      signer
    );
    newState.contractConnectors[controllerContractName].config[chainId].address = chosenControllerAddress;
    newState.contractsByName[controllerContractName][chainId] = newControllerContract;

    // contractsByChainId are recreated by "connectToAllContracts"
    delete newState.contractsByChainId;
    store.setContractState(newState);

    setTimeout(() => {
      setUpdateStore(true);
    }, 1);
  }, [chosenControllerAddress]);

  // Separating connectToAllContracts from setContractState to make sure states are updated before updating contracts
  useEffect(() => {
    if (!updateStore) return;
    store.connectToAllContracts(scaffoldAppProviders.mainnetAdaptor);
    setUpdateStore(false);
  }, [updateStore]);

  const chooseFactory = () => {
    setChosenContract(controllerFactoryContractName);
    setChosenControllerAddress(undefined);
  };

  const handleChangeController = (controllerAddress: string) => {
    setChosenContract(controllerContractName);
    setChosenControllerAddress(controllerAddress);
  };

  const selectOptions = exampleControllerAddresses.map((address) => ({
    label: address,
    value: address,
  }));

  return (
    <div className={'example-controller-container'}>
      <div className={'deployed-contracts'}>
        <div className={'deployed-contracts-row'}>
          <div className={'spacer'} />
          <div className={'title'}>Factory: </div>
          <div className={'addresses'}>
            <Button type={'primary'} onClick={chooseFactory}>
              {exampleControllerFactoryAddress}
            </Button>
          </div>
          <div className={'spacer'} />
        </div>
        <div className={'deployed-contracts-row'}>
          <div className={'spacer'} />
          <div className={'title'}>Created Controllers ({exampleControllerAddresses.length}): </div>
          <div className={'addresses'}>
            <Select value={chosenControllerAddress} style={{ width: 300 }} onChange={handleChangeController} options={selectOptions} />
          </div>
          <div className={'spacer'} />
        </div>
      </div>

      {chosenContract && chosenContract === controllerFactoryContractName && (
        <GenericContract
          contractName={controllerFactoryContractName}
          contract={exampleControllerFactoryContract}
          mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={scaffoldAppProviders.currentTargetNetwork.blockExplorer}
        />
      )}

      {chosenContract && chosenContract === controllerContractName && (
        <GenericContract
          contractName={controllerContractName}
          contract={exampleControllerContract}
          mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={scaffoldAppProviders.currentTargetNetwork.blockExplorer}
        />
      )}
    </div>
  );
};

interface IExampleController {
  controllerContractName: string;
  controllerFactoryContractName: string;
  ethersAppContext: IEthersContext;
  scaffoldAppProviders: IScaffoldAppProviders;
}
