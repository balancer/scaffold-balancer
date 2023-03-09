# 🏗 Scaffold-Balancer

> everything you need to build on Balancer! 🚀

🧪 Quickly experiment with custom AMMs using a frontend that allows you to interact with your custom pool contract(s).

🧪 Fork mainnet ethereum and test your custom pools within the context of all available liquidity.

🏗 Build and test your Smart Order Router (SOR) extension, getting you one step closer to being integrated into the Balancer ecosystem.

## Features

This project is a fork of scaffold-eth-typescript with a focus on providing [Balancer]:

- A react frontend running with `nextjs`.
- Solidity toolkit of `hardhat` or `foundry`

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> 1️⃣ clone/fork 🏗 scaffold-balancer:

```bash
git clone https://github.com/beethovenxfi/scaffold-balancer.git
```

> 2️⃣ Install all necessary dependencies

```bash
yarn install
```

> 3️⃣ start your 👷‍ Hardhat fork of mainnet ethereum:

```bash
yarn fork
```

> 4️⃣ in a second terminal window, start your 📱 frontend:

```bash
yarn dev
```

> 4️⃣ in a third terminal window, 🛰 deploy your contract:

⚠️ By default any existing contract deployments are triggerred when you start your fork of mainnet `yarn fork`. This stay may not be required.

```bash
yarn deploy
```

🔏 Edit your smart contract `YourCustomPool.sol` in `packages/solidity-ts/contracts`

💼 Edit your contract deployment scripts in `packages/solidity-ts/deploy`

📝 Edit your frontend `App.tsx` in `packages/react-app/src`

📱 Open http://localhost:3000 to see the app

## Configuration

Scaffold uses `scaffold.config.json` as a configuration file located in `/packages/common/scaffold.config.json`. You can create the config file by running the command `yarn create-config`.

### Command line help

```bash
use `-h` with any command for help.  e.g. yarn set-react -h
```

### Configure react and solidity toolkit

You can change the configuration file to pick different frontends and solidity toolkits.

```bash
yarn set-react `nextjs`
yarn set-solidity `hardhat` or `foundry`
```

### Target network

Set your `targetNetwork` in the config. This is the network the solidity toolkit is deploying against.

Set your `availableNetworks` in the config. This is the networks the frontend is available in.

You can configure it from the **config file** or from **command line**.

```bash
yarn set-network -h
yarn set-network 'localhost' 'localhost, mainnet'
```

### More commands

You can see all the other commands by using `yarn scaffold`

## Solidity Tookits Details

### Hardhat

Everything will be installed with `yarn install`.

You can use hardhat with right context using

```bash
yarn hardhat
```

### Foundry

Make sure you install foundry

1. Make sure you install foundry first. Use `curl -L https://foundry.paradigm.xyz | bash` to install foundryup

   > You can see more details here. https://book.getfoundry.sh/getting-started/installation

2. Run `yarn install:foundry` to install or update foundry in the right folder. It will also run _forge install_ automatically with the right context.

You can use foundry commands with the right context

```bash
yarn forge
yarn anvil
yarn cast
```

## Directories

The directories that you'll use are:

```bash
packages/solidity-ts/

And:
packages/next-app-ts/
```

### More Info

Other commands

```bash
# rebuild all contracts, incase of inconsistent state
yarn contracts:clean
yarn contracts:build
# run hardhat commands for the workspace, or see all tasks
yarn hardhat 'xxx'
# run forge, anvil or
yarn forge
yarn anvil
yarn cast
```

Other folders

```bash
# for subgraph checkout README.md in following directories
packages/subgraph/
packages/services/
```
