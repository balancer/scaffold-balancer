import { Divider, Typography } from 'antd';
import React from 'react';
const { Title, Paragraph, Text } = Typography;

export function PoolHeader() {
  return (
    <div>
      <Title level={2}>Pools</Title>
      <Paragraph>
        Balancer is infinitely extensible to allow for any conceivable pool type with custom curves, logic, parameters,
        and more. Each pool deployed to balancer is its own smart contract. This tool allows you to interact with any
        pool currently deployed (custom or existing). To get started, enter the contract address of the desired pool
        below. To deploy any custom pools you&apos;ve created in <Text keyboard>scaffold-balancer</Text>, add a
        deployment script in <Text keyboard>solidity-ts/deploy/hardhat-deploy/</Text> and run{' '}
        <Text keyboard>yarn deploy</Text> in a new terminal window.
      </Paragraph>
      <Divider />
    </div>
  );
}
