import {FC, useEffect, useMemo, useState} from "react";
import { GenericContract } from "eth-components/ant"
import {IEthersContext} from 'eth-hooks/context';
import { useEventListener } from 'eth-hooks';
import {Button, Select} from 'antd';

import { IScaffoldAppProviders } from '~common/models';
import {useAppContracts, useContractsAppStore} from '~common/components/context';
import {cloneDeep} from "lodash";

export const ExampleController: FC<IExampleController> = ({
  controllerContractName,
  controllerFactoryContractName,
  ethersAppContext,
  scaffoldAppProviders
}) => {
  const store = useContractsAppStore();
  const { chainId, signer } = ethersAppContext;
  const [chosenContract, setChosenContract] = useState();
  const [chosenControllerAddress, setChosenControllerAddress] = useState();

  const [updateStore, setUpdateStore] = useState(false);

  const exampleControllerContract = useAppContracts(controllerContractName, ethersAppContext.chainId)
  const exampleControllerFactoryContract = useAppContracts(controllerFactoryContractName, ethersAppContext.chainId)

  const exampleControllerFactoryAddress = exampleControllerFactoryContract?.address;
  const events = useEventListener(exampleControllerFactoryContract, 'ControllerCreated');
  const exampleControllerAddresses = useMemo(() => {
    return events[0].map(event => {
      const data = event.data;
      const topics = event.topics;
      const decodedData = event.decode(data, topics);
      return decodedData.controller;
    })
  }, [events?.[0]?.length])

  useEffect(() => {
    if (!chosenControllerAddress) return;

    const newState = cloneDeep(store.contractState);
    const controllerContract = newState.contractConnectors[controllerContractName].connect(chosenControllerAddress, signer);
    const newFactoryContract = newState.contractConnectors[controllerFactoryContractName].connect(exampleControllerFactoryAddress, signer);
    newState.contractConnectors[controllerContractName].config[chainId].address = chosenControllerAddress;
    newState.contractsByName[controllerContractName][chainId] = controllerContract;
    newState.contractsByName[controllerFactoryContractName][chainId] = newFactoryContract;
    delete newState.contractsByChainId;
    store.setContractState(newState);

    setTimeout(() => {
      setUpdateStore(true);
    }, 1)
  }, [chosenControllerAddress])

  useEffect(() => {
    const connectNewContract = async () => {
      await store.connectToContract(controllerContractName, scaffoldAppProviders.mainnetAdaptor);
      await store.connectToAllContracts(scaffoldAppProviders.mainnetAdaptor);
    }

    if (updateStore) {
      connectNewContract();
      setUpdateStore(false);
    }
  }, [updateStore]);

  const chooseFactory = () => {
    setChosenContract(controllerFactoryContractName);
  }

  const handleChangeController = (controllerAddress: string) => {
    setChosenContract(controllerContractName);
    setChosenControllerAddress(controllerAddress);
  }

  const selectOptions = exampleControllerAddresses.map(address => ({
    label: address,
    value: address
  }));

  return <div className={'example-controller-container'}>
    <div className={'deployed-contracts'}>
      <div className={'deployed-contracts-row'}>
        <div className={'spacer'}/>
        <div className={'title'}>Factory: </div>
        <div className={'addresses'}>
          <Button type={'primary'} onClick={chooseFactory}>
            {exampleControllerFactoryAddress}
          </Button>
        </div>
        <div className={'spacer'}/>
      </div>
      <div className={'deployed-contracts-row'}>
        <div className={'spacer'}/>
        <div className={'title'}>Created Controllers: </div>
        <div className={'addresses'}>
          <Select
            defaultValue=""
            style={{ width: 300 }}
            onChange={handleChangeController}
            options={selectOptions}
          />
        </div>
        <div className={'spacer'}/>
      </div>
    </div>

    {chosenContract && chosenContract === controllerFactoryContractName && <GenericContract
      contractName={controllerFactoryContractName}
      contract={exampleControllerFactoryContract}
      mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
      blockExplorer={scaffoldAppProviders.currentTargetNetwork.blockExplorer}
    /> }

    {chosenContract && chosenContract === controllerContractName && <GenericContract
      contractName={controllerContractName}
      contract={exampleControllerContract}
      mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
      blockExplorer={scaffoldAppProviders.currentTargetNetwork.blockExplorer}
    /> }
  </div>
}

interface IExampleController {
  controllerContractName: string;
  controllerFactoryContractName: string;
  ethersAppContext: IEthersContext;
  scaffoldAppProviders: IScaffoldAppProviders;
}