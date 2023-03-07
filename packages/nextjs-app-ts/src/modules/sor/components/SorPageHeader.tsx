import { Divider, Typography } from 'antd';
import React from 'react';
const { Title, Paragraph, Text } = Typography;

export function SorPageHeader() {
  return (
    <div>
      <Title level={2}>Smart Order Router (SOR)</Title>
      <Paragraph>
        The Smart Order Router (SOR) is a tool designed to optimize routing across Balancer pools for the best possible
        price execution. This tool allows you to benchmark your custom pools within the context of all available
        Balancer liquidity, utilizing the SOR.
      </Paragraph>
      <Divider />
      <Title level={4}>Pool config</Title>
      <Paragraph>
        Use the inputs below to filter the pools that will be used when calculating optimal paths between two tokens. If
        you <Text strong>include specific pools</Text>, they will be included regardless of whether they meet the pool
        type or token filter criteria. If no filters are selected AND you&apos;ve{' '}
        <Text strong>included specific pools</Text>, only those pools will be used in routing.
      </Paragraph>
      <Paragraph>
        To inject custom pools you&apos;ve deployed locally, you need to implement a{' '}
        <Text keyboard>PoolDataProvider</Text> and a <Text keyboard>BasePoolFactory</Text>. The{' '}
        <Text keyboard>PoolDataProvider</Text> should fetch all necessary data for your custom pools, and the{' '}
        <Text keyboard>BasePoolFactory</Text> tells the SOR how to interact with your custom pools. Reference
        implementations can be found in <Text keyboard>some/dir/with/references</Text>.
      </Paragraph>
    </div>
  );
}
