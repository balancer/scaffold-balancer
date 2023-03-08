import Head from 'next/head';
import React, { FC } from 'react';

import { TPageProps } from '~~/models/TAppProps';
import { MainPage } from '~~/modules/main/MainPage';

const Page: FC<TPageProps> = (props) => {
  return (
    <div className="App">
      <Head>
        <title>Scaffold-balancer</title>
        <meta name="description" content="Generated from Scaffold-eth-typescript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage pageName="main" {...props}></MainPage>;
    </div>
  );
};

export default Page;
