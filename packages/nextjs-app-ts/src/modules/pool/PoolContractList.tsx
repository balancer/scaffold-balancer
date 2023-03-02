import { Button, Input } from 'antd';
import { isAddress } from 'ethers/lib/utils';
import React, { useState } from 'react';

import { PoolContract } from '~~/modules/pool/PoolContract';

export function PoolContractList() {
  const [inputText, setInputText] = useState<string>('');
  const [poolContracts, setPoolContracts] = useState<string[]>([]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18, marginRight: 18 }}>
        <Input
          value={inputText}
          onChange={(e): void => {
            setInputText(e.target.value);
          }}
          placeholder={'Pool contract address'}
          style={{ width: 400 }}
        />
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          disabled={!isAddress(inputText)}
          onClick={() => {
            setPoolContracts([...poolContracts, inputText]);
            setInputText('');
          }}>
          Add pool contract
        </Button>
      </div>
      {poolContracts.map((contractAddress) => (
        <PoolContract key={contractAddress} address={contractAddress} />
      ))}
    </div>
  );
}
