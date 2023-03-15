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

Prerequisites: [Node (v16)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

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

📝 Edit your frontend in `packages/nextjs-app-ts/src`

💻 Open http://localhost:3000 to see the app
