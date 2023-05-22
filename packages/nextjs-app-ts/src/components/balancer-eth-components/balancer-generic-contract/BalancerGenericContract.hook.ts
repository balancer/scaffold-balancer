import { BaseContract } from 'ethers';
import { useState } from 'react';

import { IBalancerGenericContract } from './IBalancerGenericContract';

export const useBalancerGenericContract = ({ contract, contractName }: IBalancerGenericContract<BaseContract>) => {
  // Todo remove this (Only debugging purposes)
  console.log(contract);

  const [tooltipText, setTooltipText] = useState('Click to copy');

  const contractAddress = contract?.address;

  const copyAddressToClipboard = async () => {
    await navigator.clipboard.writeText(contractAddress || '');
    setTooltipText('Copied!');
  };

  const resetTooltip = () => {
    setTimeout(() => {
      setTooltipText('Click to copy');
    }, 500);
  };

  return {
    contract,
    contractAddress,
    contractName,
    copyAddressToClipboard,
    resetTooltip,
    tooltipText,
  };
};
