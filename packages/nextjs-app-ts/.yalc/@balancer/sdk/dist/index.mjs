var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/data/enrichers/onChainPoolDataEnricher.ts
import { createPublicClient as createPublicClient2, formatUnits, http as http2 } from "viem";

// src/abi/balancerQueries.ts
var balancerQueriesAbi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "enum IVault.SwapKind",
        name: "kind",
        type: "uint8"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "poolId",
            type: "bytes32"
          },
          {
            internalType: "uint256",
            name: "assetInIndex",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "assetOutIndex",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          { internalType: "bytes", name: "userData", type: "bytes" }
        ],
        internalType: "struct IVault.BatchSwapStep[]",
        name: "swaps",
        type: "tuple[]"
      },
      {
        internalType: "contract IAsset[]",
        name: "assets",
        type: "address[]"
      },
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "bool",
            name: "fromInternalBalance",
            type: "bool"
          },
          {
            internalType: "address payable",
            name: "recipient",
            type: "address"
          },
          {
            internalType: "bool",
            name: "toInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.FundManagement",
        name: "funds",
        type: "tuple"
      }
    ],
    name: "queryBatchSwap",
    outputs: [
      { internalType: "int256[]", name: "assetDeltas", type: "int256[]" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "minAmountsOut",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "userData", type: "bytes" },
          {
            internalType: "bool",
            name: "toInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.ExitPoolRequest",
        name: "request",
        type: "tuple"
      }
    ],
    name: "queryExit",
    outputs: [
      { internalType: "uint256", name: "bptIn", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "maxAmountsIn",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "userData", type: "bytes" },
          {
            internalType: "bool",
            name: "fromInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.JoinPoolRequest",
        name: "request",
        type: "tuple"
      }
    ],
    name: "queryJoin",
    outputs: [
      { internalType: "uint256", name: "bptOut", type: "uint256" },
      { internalType: "uint256[]", name: "amountsIn", type: "uint256[]" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "poolId",
            type: "bytes32"
          },
          {
            internalType: "enum IVault.SwapKind",
            name: "kind",
            type: "uint8"
          },
          {
            internalType: "contract IAsset",
            name: "assetIn",
            type: "address"
          },
          {
            internalType: "contract IAsset",
            name: "assetOut",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          { internalType: "bytes", name: "userData", type: "bytes" }
        ],
        internalType: "struct IVault.SingleSwap",
        name: "singleSwap",
        type: "tuple"
      },
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "bool",
            name: "fromInternalBalance",
            type: "bool"
          },
          {
            internalType: "address payable",
            name: "recipient",
            type: "address"
          },
          {
            internalType: "bool",
            name: "toInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.FundManagement",
        name: "funds",
        type: "tuple"
      }
    ],
    name: "querySwap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "vault",
    outputs: [
      { internalType: "contract IVault", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/abi/sorQueries.ts
var sorQueriesAbi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      }
    ],
    name: "getAmpForPools",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      }
    ],
    name: "getNormalizedWeightsForPools",
    outputs: [
      { internalType: "uint256[][]", name: "", type: "uint256[][]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "poolIds", type: "bytes32[]" },
      {
        components: [
          {
            internalType: "bool",
            name: "loadTokenBalanceUpdatesAfterBlock",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "loadTotalSupply",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "loadSwapFees",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "loadLinearWrappedTokenRates",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "loadNormalizedWeights",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "loadScalingFactors",
            type: "bool"
          },
          { internalType: "bool", name: "loadAmps", type: "bool" },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256"
          },
          {
            internalType: "enum TotalSupplyType[]",
            name: "totalSupplyTypes",
            type: "uint8[]"
          },
          {
            internalType: "enum SwapFeeType[]",
            name: "swapFeeTypes",
            type: "uint8[]"
          },
          {
            internalType: "uint256[]",
            name: "linearPoolIdxs",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "weightedPoolIdxs",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "scalingFactorPoolIdxs",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "ampPoolIdxs",
            type: "uint256[]"
          }
        ],
        internalType: "struct SorPoolDataQueryConfig",
        name: "config",
        type: "tuple"
      }
    ],
    name: "getPoolData",
    outputs: [
      {
        internalType: "uint256[][]",
        name: "balances",
        type: "uint256[][]"
      },
      {
        internalType: "uint256[]",
        name: "totalSupplies",
        type: "uint256[]"
      },
      { internalType: "uint256[]", name: "swapFees", type: "uint256[]" },
      {
        internalType: "uint256[]",
        name: "linearWrappedTokenRates",
        type: "uint256[]"
      },
      {
        internalType: "uint256[][]",
        name: "weights",
        type: "uint256[][]"
      },
      {
        internalType: "uint256[][]",
        name: "scalingFactors",
        type: "uint256[][]"
      },
      { internalType: "uint256[]", name: "amps", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "poolIds", type: "bytes32[]" },
      { internalType: "uint256", name: "blockNumber", type: "uint256" }
    ],
    name: "getPoolTokenBalancesWithUpdatesAfterBlock",
    outputs: [
      { internalType: "uint256[][]", name: "", type: "uint256[][]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      }
    ],
    name: "getScalingFactorsForPools",
    outputs: [
      { internalType: "uint256[][]", name: "", type: "uint256[][]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      },
      {
        internalType: "enum SwapFeeType[]",
        name: "swapFeeTypes",
        type: "uint8[]"
      }
    ],
    name: "getSwapFeePercentageForPools",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      },
      {
        internalType: "enum TotalSupplyType[]",
        name: "totalSupplyTypes",
        type: "uint8[]"
      }
    ],
    name: "getTotalSupplyForPools",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "poolAddresses",
        type: "address[]"
      }
    ],
    name: "getWrappedTokenRateForLinearPools",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "vault",
    outputs: [
      { internalType: "contract IVault", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/entities/token.ts
var Token = class {
  constructor(chainId, address, decimals, symbol, name, wrapped) {
    __publicField(this, "chainId");
    __publicField(this, "address");
    __publicField(this, "decimals");
    __publicField(this, "symbol");
    __publicField(this, "name");
    __publicField(this, "wrapped");
    this.chainId = chainId;
    this.address = address.toLowerCase();
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    wrapped ? this.wrapped = wrapped.toLowerCase() : this.wrapped = address.toLowerCase();
  }
  isEqual(token) {
    return this.chainId === token.chainId && this.address === token.address;
  }
  isUnderlyingEqual(token) {
    return this.chainId === token.chainId && this.wrapped === token.wrapped;
  }
};

// src/utils/constants.ts
var ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
var NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var MAX_UINT112 = 5192296858534827628530496329220095n;
var PREMINTED_STABLE_BPT = 2596148429267413814265248164610048n;
var DECIMAL_SCALES = {
  0: 1n,
  1: 10n,
  2: 100n,
  3: 1000n,
  4: 10000n,
  5: 100000n,
  6: 1000000n,
  7: 10000000n,
  8: 100000000n,
  9: 1000000000n,
  10: 10000000000n,
  11: 100000000000n,
  12: 1000000000000n,
  13: 10000000000000n,
  14: 100000000000000n,
  15: 1000000000000000n,
  16: 10000000000000000n,
  17: 100000000000000000n,
  18: 1000000000000000000n
};
var SECONDS_PER_YEAR = 31536000n;
var ChainId = /* @__PURE__ */ ((ChainId4) => {
  ChainId4[ChainId4["MAINNET"] = 1] = "MAINNET";
  ChainId4[ChainId4["GOERLI"] = 5] = "GOERLI";
  ChainId4[ChainId4["OPTIMISM"] = 10] = "OPTIMISM";
  ChainId4[ChainId4["BSC"] = 56] = "BSC";
  ChainId4[ChainId4["GNOSIS_CHAIN"] = 100] = "GNOSIS_CHAIN";
  ChainId4[ChainId4["POLYGON"] = 137] = "POLYGON";
  ChainId4[ChainId4["ZKSYNC_TESTNET"] = 280] = "ZKSYNC_TESTNET";
  ChainId4[ChainId4["ZKSYNC"] = 324] = "ZKSYNC";
  ChainId4[ChainId4["ZKEVM"] = 1101] = "ZKEVM";
  ChainId4[ChainId4["ARBITRUM_ONE"] = 42161] = "ARBITRUM_ONE";
  ChainId4[ChainId4["AVALANCHE"] = 43114] = "AVALANCHE";
  ChainId4[ChainId4["BASE_GOERLI"] = 84531] = "BASE_GOERLI";
  return ChainId4;
})(ChainId || {});
var SUBGRAPH_URLS = {
  [1 /* MAINNET */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
  [5 /* GOERLI */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2",
  [10 /* OPTIMISM */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-optimism-v2",
  [100 /* GNOSIS_CHAIN */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gnosis-chain-v2",
  [137 /* POLYGON */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2",
  [280 /* ZKSYNC_TESTNET */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-zktestnet-v2",
  [324 /* ZKSYNC */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-zksync-v2",
  [1101 /* ZKEVM */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-zkevm-v2",
  [42161 /* ARBITRUM_ONE */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2",
  [43114 /* AVALANCHE */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-avalanche-v2",
  [84531 /* BASE_GOERLI */]: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-base-goerli-v2"
};
var STELLATE_URLS = {
  [1 /* MAINNET */]: "https://balancer-v2.stellate.balancer.fi",
  [5 /* GOERLI */]: "https://balancer-goerli-v2.stellate.balancer.fi",
  [100 /* GNOSIS_CHAIN */]: "https://balancer-gnosis-chain-v2.stellate.balancer.fi",
  [137 /* POLYGON */]: "https://balancer-polygon-v2.stellate.balancer.fi",
  [42161 /* ARBITRUM_ONE */]: "https://balancer-arbitrum-v2.stellate.balancer.fi"
};
var BALANCER_QUERIES = "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5";
var BALANCER_SOR_QUERIES_ADDRESS = "0x1814a3b3e4362caf4eb54cd85b82d39bd7b34e41";
var NATIVE_ASSETS = {
  [1 /* MAINNET */]: new Token(
    1 /* MAINNET */,
    NATIVE_ADDRESS,
    18,
    "ETH",
    "Ether",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  ),
  [5 /* GOERLI */]: new Token(
    5 /* GOERLI */,
    NATIVE_ADDRESS,
    18,
    "ETH",
    "Ether",
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
  ),
  [100 /* GNOSIS_CHAIN */]: new Token(
    100 /* GNOSIS_CHAIN */,
    NATIVE_ADDRESS,
    18,
    "xDAI",
    "xDAI",
    "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"
  ),
  [137 /* POLYGON */]: new Token(
    137 /* POLYGON */,
    NATIVE_ADDRESS,
    18,
    "MATIC",
    "Matic",
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
  ),
  [42161 /* ARBITRUM_ONE */]: new Token(
    42161 /* ARBITRUM_ONE */,
    NATIVE_ADDRESS,
    18,
    "ETH",
    "Ether",
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
  )
};
var ETH = NATIVE_ASSETS[1 /* MAINNET */];
var DEFAULT_FUND_MANAGMENT = {
  sender: ZERO_ADDRESS,
  recipient: ZERO_ADDRESS,
  fromInternalBalance: false,
  toInternalBalance: false
};
var DEFAULT_USERDATA = "0x";

// src/types.ts
import { Address, Hex } from "viem";
var PoolType = /* @__PURE__ */ ((PoolType2) => {
  PoolType2["Weighted"] = "Weighted";
  PoolType2["ComposableStable"] = "ComposableStable";
  PoolType2["MetaStable"] = "MetaStable";
  PoolType2["AaveLinear"] = "AaveLinear";
  return PoolType2;
})(PoolType || {});
var SwapKind = /* @__PURE__ */ ((SwapKind2) => {
  SwapKind2[SwapKind2["GivenIn"] = 0] = "GivenIn";
  SwapKind2[SwapKind2["GivenOut"] = 1] = "GivenOut";
  return SwapKind2;
})(SwapKind || {});

// src/entities/path.ts
var Path = class {
  constructor(tokens, pools) {
    __publicField(this, "pools");
    __publicField(this, "tokens");
    if (pools.length === 0 || tokens.length < 2) {
      throw new Error(
        "Invalid path: must contain at least 1 pool and 2 tokens."
      );
    } else if (tokens.length !== pools.length + 1) {
      throw new Error(
        "Invalid path: tokens length must equal pools length + 1"
      );
    }
    this.pools = pools;
    this.tokens = tokens;
  }
};
var PathWithAmount = class extends Path {
  constructor(tokens, pools, swapAmount, mutateBalances) {
    super(tokens, pools);
    __publicField(this, "swapAmount");
    __publicField(this, "swapKind");
    __publicField(this, "outputAmount");
    __publicField(this, "inputAmount");
    __publicField(this, "mutateBalances");
    __publicField(this, "printPath", []);
    this.swapAmount = swapAmount;
    this.mutateBalances = Boolean(mutateBalances);
    if (tokens[0].isUnderlyingEqual(swapAmount.token)) {
      this.swapKind = 0 /* GivenIn */;
    } else {
      this.swapKind = 1 /* GivenOut */;
    }
    try {
      if (this.swapKind === 0 /* GivenIn */) {
        const amounts = new Array(this.tokens.length);
        amounts[0] = this.swapAmount;
        for (let i = 0; i < this.pools.length; i++) {
          const pool = this.pools[i];
          const outputAmount = pool.swapGivenIn(
            this.tokens[i],
            this.tokens[i + 1],
            amounts[i],
            this.mutateBalances
          );
          amounts[i + 1] = outputAmount;
          this.printPath.push({
            pool: pool.id,
            input: `${amounts[i].amount.toString()} ${this.tokens[i].symbol}`,
            output: `${outputAmount.amount.toString()} ${this.tokens[i + 1].symbol}`
          });
        }
        this.outputAmount = amounts[amounts.length - 1];
        this.inputAmount = this.swapAmount;
      } else {
        const amounts = new Array(this.tokens.length);
        amounts[amounts.length - 1] = this.swapAmount;
        for (let i = this.pools.length; i >= 1; i--) {
          const pool = this.pools[i - 1];
          const inputAmount = pool.swapGivenOut(
            this.tokens[i - 1],
            this.tokens[i],
            amounts[i],
            this.mutateBalances
          );
          amounts[i - 1] = inputAmount;
          this.printPath.push({
            pool: pool.id,
            input: `${inputAmount.amount.toString()} ${this.tokens[i - 1].symbol}`,
            output: `${amounts[i].amount.toString()} ${this.tokens[i].symbol}`
          });
        }
        this.printPath = this.printPath.reverse();
        this.inputAmount = amounts[0];
        this.outputAmount = this.swapAmount;
      }
    } catch {
      throw new Error(
        "Invalid path, swap amount exceeds maximum for pool"
      );
    }
  }
  print() {
    console.table(this.printPath);
  }
};

// src/entities/tokenAmount.ts
import _Decimal from "decimal.js-light";
import { parseUnits } from "viem";
var TokenAmount = class {
  constructor(token, amount) {
    __publicField(this, "token");
    __publicField(this, "scalar");
    __publicField(this, "decimalScale");
    __publicField(this, "amount");
    __publicField(this, "scale18");
    this.decimalScale = DECIMAL_SCALES[token.decimals];
    this.token = token;
    this.amount = BigInt(amount);
    this.scalar = DECIMAL_SCALES[18 - token.decimals];
    this.scale18 = this.amount * this.scalar;
  }
  static fromRawAmount(token, rawAmount) {
    return new TokenAmount(token, rawAmount);
  }
  static fromHumanAmount(token, humanAmount) {
    const rawAmount = parseUnits(humanAmount, token.decimals);
    return new TokenAmount(token, rawAmount);
  }
  static fromScale18Amount(token, scale18Amount, divUp) {
    const scalar = DECIMAL_SCALES[18 - token.decimals];
    const rawAmount = divUp ? 1n + (BigInt(scale18Amount) - 1n) / scalar : BigInt(scale18Amount) / scalar;
    return new TokenAmount(token, rawAmount);
  }
  add(other) {
    return new TokenAmount(this.token, this.amount + other.amount);
  }
  sub(other) {
    return new TokenAmount(this.token, this.amount - other.amount);
  }
  mulUpFixed(other) {
    const product = this.amount * other;
    const multiplied = (product - 1n) / WAD + 1n;
    return new TokenAmount(this.token, multiplied);
  }
  mulDownFixed(other) {
    const multiplied = this.amount * other / WAD;
    return new TokenAmount(this.token, multiplied);
  }
  divUpFixed(other) {
    const divided = (this.amount * WAD + other - 1n) / other;
    return new TokenAmount(this.token, divided);
  }
  divDownFixed(other) {
    const divided = this.amount * WAD / other;
    return new TokenAmount(this.token, divided);
  }
  toSignificant(significantDigits = 6) {
    return new _Decimal(this.amount.toString()).div(new _Decimal(this.decimalScale.toString())).toDecimalPlaces(significantDigits).toString();
  }
};

// src/entities/swap.ts
import {
  createPublicClient,
  encodeFunctionData,
  getContract,
  http
} from "viem";
var Swap = class {
  constructor({
    paths,
    swapKind
  }) {
    __publicField(this, "chainId");
    __publicField(this, "isBatchSwap");
    __publicField(this, "paths");
    __publicField(this, "assets");
    __publicField(this, "swapKind");
    __publicField(this, "swaps");
    if (paths.length === 0)
      throw new Error("Invalid swap: must contain at least 1 path.");
    this.paths = paths.map(
      (path) => new PathWithAmount(
        path.tokens,
        path.pools,
        path.swapAmount,
        true
      )
    );
    this.chainId = paths[0].tokens[0].chainId;
    this.swapKind = swapKind;
    this.isBatchSwap = paths.length > 1 || paths[0].pools.length > 1;
    this.assets = [
      ...new Set(paths.flatMap((p) => p.tokens).map((t) => t.address))
    ];
    let swaps;
    if (this.isBatchSwap) {
      swaps = [];
      if (this.swapKind === 0 /* GivenIn */) {
        this.paths.map((p) => {
          p.pools.map((pool, i) => {
            swaps.push({
              poolId: pool.id,
              assetInIndex: BigInt(
                this.assets.indexOf(p.tokens[i].address)
              ),
              assetOutIndex: BigInt(
                this.assets.indexOf(p.tokens[i + 1].address)
              ),
              amount: i === 0 ? p.inputAmount.amount : 0n,
              userData: DEFAULT_USERDATA
            });
          });
        });
      } else {
        this.paths.map((p) => {
          const reversedPools = [...p.pools].reverse();
          const reversedTokens = [...p.tokens].reverse();
          reversedPools.map((pool, i) => {
            swaps.push({
              poolId: pool.id,
              assetInIndex: BigInt(
                this.assets.indexOf(
                  reversedTokens[i + 1].address
                )
              ),
              assetOutIndex: BigInt(
                this.assets.indexOf(reversedTokens[i].address)
              ),
              amount: i === 0 ? p.outputAmount.amount : 0n,
              userData: DEFAULT_USERDATA
            });
          });
        });
      }
    } else {
      const path = this.paths[0];
      const pool = path.pools[0];
      const assetIn = this.convertNativeAddressToZero(
        path.tokens[0].address
      );
      const assetOut = this.convertNativeAddressToZero(
        path.tokens[1].address
      );
      swaps = {
        poolId: pool.id,
        kind: this.swapKind,
        assetIn,
        assetOut,
        amount: path.swapAmount.amount,
        userData: DEFAULT_USERDATA
      };
    }
    this.assets = this.assets.map((a) => {
      return this.convertNativeAddressToZero(a);
    });
    this.swaps = swaps;
  }
  get quote() {
    return this.swapKind === 0 /* GivenIn */ ? this.outputAmount : this.inputAmount;
  }
  get inputAmount() {
    if (!this.paths.every(
      (p) => p.inputAmount.token.isEqual(this.paths[0].inputAmount.token)
    )) {
      throw new Error(
        "Input amount can only be calculated if all paths have the same input token"
      );
    }
    const amounts = this.paths.map((path) => path.inputAmount);
    return amounts.reduce((a, b) => a.add(b));
  }
  get outputAmount() {
    if (!this.paths.every(
      (p) => p.outputAmount.token.isEqual(this.paths[0].outputAmount.token)
    )) {
      throw new Error(
        "Output amount can only be calculated if all paths have the same output token"
      );
    }
    const amounts = this.paths.map((path) => path.outputAmount);
    return amounts.reduce((a, b) => a.add(b));
  }
  // rpcUrl is optional, but recommended to prevent rate limiting
  async query(rpcUrl, block) {
    const publicClient = createPublicClient({
      transport: http(rpcUrl)
    });
    const queriesContract = getContract({
      address: BALANCER_QUERIES,
      abi: balancerQueriesAbi,
      publicClient
    });
    let amount;
    if (this.isBatchSwap) {
      const { result } = await queriesContract.simulate.queryBatchSwap(
        [
          this.swapKind,
          this.swaps,
          this.assets,
          DEFAULT_FUND_MANAGMENT
        ],
        {
          blockNumber: block
        }
      );
      amount = this.swapKind === 0 /* GivenIn */ ? TokenAmount.fromRawAmount(
        this.outputAmount.token,
        abs(
          result[this.assets.indexOf(
            this.convertNativeAddressToZero(
              this.outputAmount.token.address
            )
          )]
        )
      ) : TokenAmount.fromRawAmount(
        this.inputAmount.token,
        abs(
          result[this.assets.indexOf(
            this.convertNativeAddressToZero(
              this.inputAmount.token.address
            )
          )]
        )
      );
    } else {
      const { result } = await queriesContract.simulate.querySwap(
        [this.swaps, DEFAULT_FUND_MANAGMENT],
        { blockNumber: block }
      );
      amount = this.swapKind === 0 /* GivenIn */ ? TokenAmount.fromRawAmount(this.outputAmount.token, result) : TokenAmount.fromRawAmount(this.inputAmount.token, result);
    }
    return amount;
  }
  convertNativeAddressToZero(address) {
    return address === NATIVE_ADDRESS ? ZERO_ADDRESS : address;
  }
  queryCallData() {
    let callData;
    if (this.isBatchSwap) {
      callData = encodeFunctionData({
        abi: balancerQueriesAbi,
        functionName: "queryBatchSwap",
        args: [
          this.swapKind,
          this.swaps,
          this.assets,
          DEFAULT_FUND_MANAGMENT
        ]
      });
    } else {
      callData = encodeFunctionData({
        abi: balancerQueriesAbi,
        functionName: "querySwap",
        args: [this.swaps, DEFAULT_FUND_MANAGMENT]
      });
    }
    return callData;
  }
  // public get executionPrice(): Price {}
  // public get priceImpact(): Percent {}
};

// src/utils/helpers.ts
function checkInputs(tokenIn, tokenOut, swapKind, swapAmount) {
  if (!(swapAmount instanceof TokenAmount)) {
    swapAmount = TokenAmount.fromRawAmount(
      swapKind === 0 /* GivenIn */ ? tokenIn : tokenOut,
      swapAmount
    );
  }
  if (tokenIn.chainId !== tokenOut.chainId || tokenIn.chainId !== swapAmount.token.chainId) {
    throw new Error("ChainId mismatch for inputs");
  }
  if (swapKind === 0 /* GivenIn */ && !tokenIn.isEqual(swapAmount.token) || swapKind === 1 /* GivenOut */ && !tokenOut.isEqual(swapAmount.token)) {
    throw new Error("Swap amount token does not match input token");
  }
  return swapAmount;
}

// src/utils/math.ts
var WAD = 1000000000000000000n;
var TWO_WAD = 2000000000000000000n;
var FOUR_WAD = 4000000000000000000n;
var abs = (n) => n < 0n ? -n : n;
var _require = (b, message) => {
  if (!b)
    throw new Error(message);
};
var MathSol = class {
  static max(a, b) {
    return a >= b ? a : b;
  }
  static min(a, b) {
    return a < b ? a : b;
  }
  static mulDownFixed(a, b) {
    const product = a * b;
    return product / WAD;
  }
  static mulUpFixed(a, b) {
    const product = a * b;
    if (product === 0n) {
      return 0n;
    } else {
      return (product - 1n) / WAD + 1n;
    }
  }
  static divDownFixed(a, b) {
    if (a === 0n) {
      return 0n;
    } else {
      const aInflated = a * WAD;
      return aInflated / b;
    }
  }
  static divUpFixed(a, b) {
    if (a === 0n) {
      return 0n;
    } else {
      const aInflated = a * WAD;
      return (aInflated - 1n) / b + 1n;
    }
  }
  static divUp(a, b) {
    if (a === 0n) {
      return 0n;
    } else {
      return 1n + (a - 1n) / b;
    }
  }
  // version = poolTypeVersion
  static powUpFixed(x, y, version) {
    if (y === WAD && version !== 1) {
      return x;
    } else if (y === TWO_WAD && version !== 1) {
      return this.mulUpFixed(x, x);
    } else if (y === FOUR_WAD && version !== 1) {
      const square = this.mulUpFixed(x, x);
      return this.mulUpFixed(square, square);
    } else {
      const raw = LogExpMath.pow(x, y);
      const maxError = this.mulUpFixed(raw, this.MAX_POW_RELATIVE_ERROR) + 1n;
      return raw + maxError;
    }
  }
  // version = poolTypeVersion
  static powDownFixed(x, y, version) {
    if (y === WAD && version !== 1) {
      return x;
    } else if (y === TWO_WAD && version !== 1) {
      return this.mulUpFixed(x, x);
    } else if (y === FOUR_WAD && version !== 1) {
      const square = this.mulUpFixed(x, x);
      return this.mulUpFixed(square, square);
    } else {
      const raw = LogExpMath.pow(x, y);
      const maxError = this.mulUpFixed(raw, this.MAX_POW_RELATIVE_ERROR) + 1n;
      if (raw < maxError) {
        return 0n;
      } else {
        return raw - maxError;
      }
    }
  }
  static complementFixed(x) {
    return x < WAD ? WAD - x : 0n;
  }
};
__publicField(MathSol, "MAX_POW_RELATIVE_ERROR", 10000n);
var _LogExpMath = class {
  // eˆ(x11)
  // All arguments and return values are 18 decimal fixed point numbers.
  static pow(x, y) {
    if (y === 0n) {
      return this.ONE_18;
    }
    if (x === 0n) {
      return 0n;
    }
    _require(
      x < BigInt(
        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
      ),
      "Errors.X_OUT_OF_BOUNDS"
    );
    const x_int256 = x;
    _require(y < this.MILD_EXPONENT_BOUND, "Errors.Y_OUT_OF_BOUNDS");
    const y_int256 = y;
    let logx_times_y;
    if (this.LN_36_LOWER_BOUND < x_int256 && x_int256 < this.LN_36_UPPER_BOUND) {
      const ln_36_x = this._ln_36(x_int256);
      logx_times_y = ln_36_x / this.ONE_18 * y_int256 + ln_36_x % this.ONE_18 * y_int256 / this.ONE_18;
    } else {
      logx_times_y = this._ln(x_int256) * y_int256;
    }
    logx_times_y /= this.ONE_18;
    _require(
      this.MIN_NATURAL_EXPONENT <= logx_times_y && logx_times_y <= this.MAX_NATURAL_EXPONENT,
      "Errors.PRODUCT_OUT_OF_BOUNDS"
    );
    return this.exp(logx_times_y);
  }
  static exp(x) {
    _require(
      x >= this.MIN_NATURAL_EXPONENT && x <= this.MAX_NATURAL_EXPONENT,
      "Errors.INVALID_EXPONENT"
    );
    if (x < 0) {
      return this.ONE_18 * this.ONE_18 / this.exp(BigInt(-1) * x);
    }
    let firstAN;
    if (x >= this.x0) {
      x -= this.x0;
      firstAN = this.a0;
    } else if (x >= this.x1) {
      x -= this.x1;
      firstAN = this.a1;
    } else {
      firstAN = BigInt(1);
    }
    x *= BigInt(100);
    let product = this.ONE_20;
    if (x >= this.x2) {
      x -= this.x2;
      product = product * this.a2 / this.ONE_20;
    }
    if (x >= this.x3) {
      x -= this.x3;
      product = product * this.a3 / this.ONE_20;
    }
    if (x >= this.x4) {
      x -= this.x4;
      product = product * this.a4 / this.ONE_20;
    }
    if (x >= this.x5) {
      x -= this.x5;
      product = product * this.a5 / this.ONE_20;
    }
    if (x >= this.x6) {
      x -= this.x6;
      product = product * this.a6 / this.ONE_20;
    }
    if (x >= this.x7) {
      x -= this.x7;
      product = product * this.a7 / this.ONE_20;
    }
    if (x >= this.x8) {
      x -= this.x8;
      product = product * this.a8 / this.ONE_20;
    }
    if (x >= this.x9) {
      x -= this.x9;
      product = product * this.a9 / this.ONE_20;
    }
    let seriesSum = this.ONE_20;
    let term;
    term = x;
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(2);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(3);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(4);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(5);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(6);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(7);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(8);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(9);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(10);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(11);
    seriesSum += term;
    term = term * x / this.ONE_20 / BigInt(12);
    seriesSum += term;
    return product * seriesSum / this.ONE_20 * firstAN / BigInt(100);
  }
  static _ln_36(x) {
    x *= this.ONE_18;
    const z = (x - this.ONE_36) * this.ONE_36 / (x + this.ONE_36);
    const z_squared = z * z / this.ONE_36;
    let num = z;
    let seriesSum = num;
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(3);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(5);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(7);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(9);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(11);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(13);
    num = num * z_squared / this.ONE_36;
    seriesSum += num / BigInt(15);
    return seriesSum * BigInt(2);
  }
  /**
   * @dev Internal natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
   */
  static _ln(a) {
    if (a < this.ONE_18) {
      return BigInt(-1) * this._ln(this.ONE_18 * this.ONE_18 / a);
    }
    let sum = 0n;
    if (a >= this.a0 * this.ONE_18) {
      a /= this.a0;
      sum += this.x0;
    }
    if (a >= this.a1 * this.ONE_18) {
      a /= this.a1;
      sum += this.x1;
    }
    sum *= BigInt(100);
    a *= BigInt(100);
    if (a >= this.a2) {
      a = a * this.ONE_20 / this.a2;
      sum += this.x2;
    }
    if (a >= this.a3) {
      a = a * this.ONE_20 / this.a3;
      sum += this.x3;
    }
    if (a >= this.a4) {
      a = a * this.ONE_20 / this.a4;
      sum += this.x4;
    }
    if (a >= this.a5) {
      a = a * this.ONE_20 / this.a5;
      sum += this.x5;
    }
    if (a >= this.a6) {
      a = a * this.ONE_20 / this.a6;
      sum += this.x6;
    }
    if (a >= this.a7) {
      a = a * this.ONE_20 / this.a7;
      sum += this.x7;
    }
    if (a >= this.a8) {
      a = a * this.ONE_20 / this.a8;
      sum += this.x8;
    }
    if (a >= this.a9) {
      a = a * this.ONE_20 / this.a9;
      sum += this.x9;
    }
    if (a >= this.a10) {
      a = a * this.ONE_20 / this.a10;
      sum += this.x10;
    }
    if (a >= this.a11) {
      a = a * this.ONE_20 / this.a11;
      sum += this.x11;
    }
    const z = (a - this.ONE_20) * this.ONE_20 / (a + this.ONE_20);
    const z_squared = z * z / this.ONE_20;
    let num = z;
    let seriesSum = num;
    num = num * z_squared / this.ONE_20;
    seriesSum += num / BigInt(3);
    num = num * z_squared / this.ONE_20;
    seriesSum += num / BigInt(5);
    num = num * z_squared / this.ONE_20;
    seriesSum += num / BigInt(7);
    num = num * z_squared / this.ONE_20;
    seriesSum += num / BigInt(9);
    num = num * z_squared / this.ONE_20;
    seriesSum += num / BigInt(11);
    seriesSum *= BigInt(2);
    return (sum + seriesSum) / BigInt(100);
  }
};
var LogExpMath = _LogExpMath;
// All fixed point multiplications and divisions are inlined. This means we need to divide by ONE when multiplying
// two numbers, and multiply by ONE when dividing them.
// All arguments and return values are 18 decimal fixed point numbers.
__publicField(LogExpMath, "ONE_18", BigInt("1000000000000000000"));
// Internally, intermediate values are computed with higher precision as 20 decimal fixed point numbers, and in the
// case of ln36, 36 decimals.
__publicField(LogExpMath, "ONE_20", BigInt("100000000000000000000"));
__publicField(LogExpMath, "ONE_36", BigInt("1000000000000000000000000000000000000"));
// The domain of natural exponentiation is bound by the word size and number of decimals used.
//
// Because internally the result will be stored using 20 decimals, the largest possible result is
// (2^255 - 1) / 10^20, which makes the largest exponent ln((2^255 - 1) / 10^20) = 130.700829182905140221.
// The smallest possible result is 10^(-18), which makes largest negative argument
// ln(10^(-18)) = -41.446531673892822312.
// We use 130.0 and -41.0 to have some safety margin.
__publicField(LogExpMath, "MAX_NATURAL_EXPONENT", BigInt("130000000000000000000"));
__publicField(LogExpMath, "MIN_NATURAL_EXPONENT", BigInt("-41000000000000000000"));
// Bounds for ln_36's argument. Both ln(0.9) and ln(1.1) can be represented with 36 decimal places in a fixed point
// 256 bit integer.
__publicField(LogExpMath, "LN_36_LOWER_BOUND", BigInt(_LogExpMath.ONE_18) - BigInt("100000000000000000"));
__publicField(LogExpMath, "LN_36_UPPER_BOUND", BigInt(_LogExpMath.ONE_18) + BigInt("100000000000000000"));
// static MILD_EXPONENT_BOUND: bigint = BigInt(2) ** BigInt(254) / LogExpMath.ONE_20;
// Precomputed value of the above expression
__publicField(LogExpMath, "MILD_EXPONENT_BOUND", BigInt(
  "289480223093290488558927462521719769633174961664101410098"
));
// 18 decimal constants
__publicField(LogExpMath, "x0", BigInt("128000000000000000000"));
// 2ˆ7
__publicField(LogExpMath, "a0", BigInt(
  "38877084059945950922200000000000000000000000000000000000"
));
// eˆ(x0) (no decimals)
__publicField(LogExpMath, "x1", BigInt("64000000000000000000"));
// 2ˆ6
__publicField(LogExpMath, "a1", BigInt("6235149080811616882910000000"));
// eˆ(x1) (no decimals)
// 20 decimal constants
__publicField(LogExpMath, "x2", BigInt("3200000000000000000000"));
// 2ˆ5
__publicField(LogExpMath, "a2", BigInt("7896296018268069516100000000000000"));
// eˆ(x2)
__publicField(LogExpMath, "x3", BigInt("1600000000000000000000"));
// 2ˆ4
__publicField(LogExpMath, "a3", BigInt("888611052050787263676000000"));
// eˆ(x3)
__publicField(LogExpMath, "x4", BigInt("800000000000000000000"));
// 2ˆ3
__publicField(LogExpMath, "a4", BigInt("298095798704172827474000"));
// eˆ(x4)
__publicField(LogExpMath, "x5", BigInt("400000000000000000000"));
// 2ˆ2
__publicField(LogExpMath, "a5", BigInt("5459815003314423907810"));
// eˆ(x5)
__publicField(LogExpMath, "x6", BigInt("200000000000000000000"));
// 2ˆ1
__publicField(LogExpMath, "a6", BigInt("738905609893065022723"));
// eˆ(x6)
__publicField(LogExpMath, "x7", BigInt("100000000000000000000"));
// 2ˆ0
__publicField(LogExpMath, "a7", BigInt("271828182845904523536"));
// eˆ(x7)
__publicField(LogExpMath, "x8", BigInt("50000000000000000000"));
// 2ˆ-1
__publicField(LogExpMath, "a8", BigInt("164872127070012814685"));
// eˆ(x8)
__publicField(LogExpMath, "x9", BigInt("25000000000000000000"));
// 2ˆ-2
__publicField(LogExpMath, "a9", BigInt("128402541668774148407"));
// eˆ(x9)
__publicField(LogExpMath, "x10", BigInt("12500000000000000000"));
// 2ˆ-3
__publicField(LogExpMath, "a10", BigInt("113314845306682631683"));
// eˆ(x10)
__publicField(LogExpMath, "x11", BigInt("6250000000000000000"));
// 2ˆ-4
__publicField(LogExpMath, "a11", BigInt("106449445891785942956"));

// src/utils/pool.ts
var getPoolAddress = (poolId) => {
  if (poolId.length !== 66)
    throw new Error("Invalid poolId length");
  return poolId.slice(0, 42).toLowerCase();
};
function poolIsLinearPool(poolType) {
  return poolType.includes("Linear");
}
function poolHasVirtualSupply(poolType) {
  return poolType === "PhantomStable" || poolIsLinearPool(poolType);
}
function poolHasActualSupply(poolType) {
  return poolType === "ComposableStable";
}
function poolHasPercentFee(poolType) {
  return poolType === "Element";
}

// src/data/enrichers/onChainPoolDataEnricher.ts
var OnChainPoolDataEnricher = class {
  constructor(rpcUrl, sorQueriesAddress, config) {
    this.rpcUrl = rpcUrl;
    this.sorQueriesAddress = sorQueriesAddress;
    __publicField(this, "config");
    this.config = {
      loadTokenBalances: "updates-after-block",
      blockNumber: 0n,
      loadTotalSupply: true,
      loadLinearWrappedTokenRates: true,
      loadSwapFees: true,
      loadAmpForPools: {},
      loadScalingFactorForPools: {},
      loadWeightsForPools: {},
      ...config
    };
  }
  async fetchAdditionalPoolData(data, options) {
    const rawPools = data.pools;
    if (rawPools.length === 0) {
      return [];
    }
    const {
      poolIds,
      weightedPoolIdxs,
      ampPoolIdxs,
      linearPoolIdxs,
      totalSupplyTypes,
      scalingFactorPoolIdxs,
      swapFeeTypes
    } = this.getPoolDataQueryParams(data);
    const client = createPublicClient2({
      transport: http2(this.rpcUrl)
    });
    const [
      balances,
      totalSupplies,
      swapFees,
      linearWrappedTokenRates,
      weights,
      scalingFactors,
      amps
    ] = await client.readContract({
      address: this.sorQueriesAddress,
      abi: sorQueriesAbi,
      functionName: "getPoolData",
      args: [
        poolIds,
        {
          loadTokenBalanceUpdatesAfterBlock: this.config.loadTokenBalances !== "none",
          loadTotalSupply: this.config.loadTotalSupply,
          loadSwapFees: this.config.loadSwapFees,
          loadLinearWrappedTokenRates: this.config.loadLinearWrappedTokenRates,
          loadNormalizedWeights: weightedPoolIdxs.length > 0,
          loadScalingFactors: scalingFactorPoolIdxs.length > 0,
          loadAmps: ampPoolIdxs.length > 0,
          blockNumber: data.syncedToBlockNumber && this.config.loadTokenBalances === "updates-after-block" ? data.syncedToBlockNumber : 0n,
          totalSupplyTypes,
          swapFeeTypes,
          linearPoolIdxs,
          weightedPoolIdxs,
          scalingFactorPoolIdxs,
          ampPoolIdxs
        }
      ],
      blockNumber: options.block
    });
    return poolIds.map((_poolId, i) => ({
      id: poolIds[i],
      balances: balances[i],
      totalSupply: totalSupplies[i],
      weights: weightedPoolIdxs.includes(BigInt(i)) ? weights[weightedPoolIdxs.indexOf(BigInt(i))] : void 0,
      amp: ampPoolIdxs.includes(BigInt(i)) ? amps[ampPoolIdxs.indexOf(BigInt(i))] : void 0,
      wrappedTokenRate: linearPoolIdxs.includes(BigInt(i)) ? linearWrappedTokenRates[linearPoolIdxs.indexOf(BigInt(i))] : void 0,
      scalingFactors: scalingFactors[i],
      swapFee: swapFees[i]
    }));
  }
  enrichPoolsWithData(pools, additionalPoolData) {
    return pools.map((pool) => {
      const data = additionalPoolData.find((item) => item.id === pool.id);
      return {
        ...pool,
        tokens: pool.tokens.sort((a, b) => a.index - b.index).map((token) => {
          return {
            ...token,
            balance: data?.balances && data.balances.length > 0 ? formatUnits(
              data.balances[token.index],
              token.decimals
            ) : token.balance,
            priceRate: this.getPoolTokenRate({
              pool,
              token,
              data,
              index: token.index
            }),
            weight: data?.weights ? formatUnits(data.weights[token.index], 18) : token.weight
          };
        }),
        totalShares: data?.totalSupply ? formatUnits(data.totalSupply, 18) : pool.totalShares,
        amp: data?.amp ? formatUnits(data.amp, 3).split(".")[0] : "amp" in pool ? pool.amp : void 0,
        swapFee: data?.swapFee ? formatUnits(data.swapFee, 18) : pool.swapFee
      };
    });
  }
  getPoolDataQueryParams(data) {
    const poolIds = [];
    const totalSupplyTypes = [];
    const linearPoolIdxs = [];
    const weightedPoolIdxs = [];
    const ampPoolIdxs = [];
    const scalingFactorPoolIdxs = [];
    const swapFeeTypes = [];
    const {
      loadScalingFactorForPoolTypes,
      loadScalingFactorForPoolIds,
      loadWeightsForPoolTypes,
      loadAmpForPoolTypes,
      loadAmpForPoolIds,
      loadWeightsForPoolIds
    } = this.getMergedFilterConfig(data);
    for (let i = 0; i < data.pools.length; i++) {
      const pool = data.pools[i];
      poolIds.push(pool.id);
      totalSupplyTypes.push(
        poolHasVirtualSupply(pool.poolType) ? 1 /* VIRTUAL_SUPPLY */ : poolHasActualSupply(pool.poolType) ? 2 /* ACTUAL_SUPPLY */ : 0 /* TOTAL_SUPPLY */
      );
      if (poolIsLinearPool(pool.poolType)) {
        linearPoolIdxs.push(BigInt(i));
      }
      if (loadWeightsForPoolTypes.has(pool.poolType) || loadWeightsForPoolIds.has(pool.id)) {
        weightedPoolIdxs.push(BigInt(i));
      }
      if (loadAmpForPoolTypes.has(pool.poolType) || loadAmpForPoolIds.has(pool.id)) {
        ampPoolIdxs.push(BigInt(i));
      }
      if (loadScalingFactorForPoolIds.has(pool.id) || loadScalingFactorForPoolTypes.has(pool.poolType)) {
        scalingFactorPoolIdxs.push(BigInt(i));
      }
      if (this.config.loadSwapFees) {
        swapFeeTypes.push(
          poolHasPercentFee(pool.poolType) ? 1 /* PERCENT_FEE */ : 0 /* SWAP_FEE_PERCENTAGE */
        );
      }
    }
    return {
      poolIds,
      totalSupplyTypes,
      linearPoolIdxs,
      weightedPoolIdxs,
      ampPoolIdxs,
      scalingFactorPoolIdxs,
      swapFeeTypes
    };
  }
  getMergedFilterConfig({
    poolsWithActiveWeightUpdates = [],
    poolsWithActiveAmpUpdates = []
  }) {
    const {
      loadWeightsForPools,
      loadScalingFactorForPools,
      loadAmpForPools
    } = this.config;
    const loadWeightsForPoolIds = /* @__PURE__ */ new Set([
      ...poolsWithActiveWeightUpdates,
      ...loadWeightsForPools.poolIds || []
    ]);
    const loadAmpForPoolIds = /* @__PURE__ */ new Set([
      ...poolsWithActiveAmpUpdates,
      ...loadAmpForPools.poolIds || []
    ]);
    const loadScalingFactorForPoolIds = new Set(
      loadScalingFactorForPools.poolIds || []
    );
    const loadWeightsForPoolTypes = new Set(
      loadWeightsForPools.poolTypes || []
    );
    const loadAmpForPoolTypes = new Set(loadAmpForPools.poolTypes || []);
    const loadScalingFactorForPoolTypes = new Set(
      loadScalingFactorForPools.poolTypes || []
    );
    return {
      loadWeightsForPoolIds,
      loadAmpForPoolIds,
      loadScalingFactorForPoolIds,
      loadWeightsForPoolTypes,
      loadAmpForPoolTypes,
      loadScalingFactorForPoolTypes
    };
  }
  getPoolTokenRate({
    pool,
    token,
    data,
    index
  }) {
    if (data?.wrappedTokenRate && "wrappedIndex" in pool && pool.wrappedIndex === index) {
      return formatUnits(data.wrappedTokenRate, 18);
    }
    if (data?.scalingFactors) {
      return formatUnits(data.scalingFactors[index], 18);
    }
    return token.priceRate;
  }
};

// src/utils/fetch.ts
import { default as retry } from "async-retry";
async function fetchWithRetry(fetch2, config = { retries: 1 }) {
  let response = null;
  await retry(
    async () => {
      response = await fetch2();
      return response;
    },
    {
      retries: config.retries
    }
  );
  return response;
}

// src/data/providers/subgraphPoolProvider.ts
BigInt.prototype["toJSON"] = function() {
  return this.toString();
};
var PAGE_SIZE = 1e3;
var SECS_IN_HOUR = 3600n;
var SubgraphPoolProvider = class {
  constructor(chainId, subgraphUrl, config) {
    __publicField(this, "url");
    __publicField(this, "config");
    const defaultSubgraphUrl = SUBGRAPH_URLS[chainId];
    this.url = subgraphUrl ?? defaultSubgraphUrl;
    const hasFilterConfig = config && (config.poolIdNotIn || config.poolIdIn || config.poolTypeIn || config.poolTypeNotIn);
    this.config = {
      retries: 2,
      timeout: 3e4,
      loadActiveAmpUpdates: true,
      // we assume a public subgraph is being used, so default to false
      addFilterToPoolQuery: false,
      // by default, we exclude pool types with weight updates.
      // if any filtering config is provided, this exclusion is removed.
      poolTypeNotIn: !hasFilterConfig ? ["Investment", "LiquidityBootstrapping"] : void 0,
      ...config
    };
  }
  async getPools(options) {
    const response = await fetchWithRetry(
      () => this.fetchDataFromSubgraph(options)
    );
    return {
      ...response,
      pools: response?.pools || [],
      syncedToBlockNumber: response?.syncedToBlockNumber || 0n
    };
  }
  async fetchDataFromSubgraph(options) {
    let ampUpdates = [];
    let syncedToBlockNumber = 0n;
    let lastId = "";
    let pools = [];
    let poolsPage = [];
    const nowMinusOneHour = options.timestamp - SECS_IN_HOUR;
    const nowPlusOneHour = options.timestamp + SECS_IN_HOUR;
    do {
      const query = this.getPoolsQuery(lastId === "");
      const variables = {
        pageSize: PAGE_SIZE,
        where: {
          id_gt: lastId || void 0,
          ...this.config.addFilterToPoolQuery ? {
            totalShares_gt: 1e-12,
            swapEnabled: true,
            poolType_in: this.config.poolTypeIn,
            poolType_not_in: this.config.poolTypeNotIn,
            id_in: this.config.poolIdIn,
            id_not_in: this.config.poolIdNotIn
          } : {}
        },
        ...options?.block ? {
          block: {
            number: Number(options.block)
          }
        } : {},
        ampUpdatesWhere: {
          endTimestamp_gte: nowMinusOneHour,
          startTimestamp_lte: nowPlusOneHour
        },
        weightedUpdatesWhere: {
          endTimestamp_gte: nowMinusOneHour,
          startTimestamp_lte: nowPlusOneHour
        }
      };
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          variables
        })
      });
      const poolsResult = await response.json();
      poolsPage = poolsResult.data.pools;
      pools = pools.concat(poolsPage);
      if (lastId === "") {
        ampUpdates = poolsResult.ampUpdates || [];
      }
      if (poolsResult._meta) {
        syncedToBlockNumber = BigInt(poolsResult._meta.block.number);
      }
      lastId = pools[pools.length - 1].id;
    } while (poolsPage.length === PAGE_SIZE);
    if (!this.config.addFilterToPoolQuery) {
      pools = pools.filter((pool) => this.poolMatchesFilter(pool));
    }
    return {
      pools,
      poolsWithActiveAmpUpdates: ampUpdates.map(
        (update) => update.poolId.id
      ),
      syncedToBlockNumber
    };
  }
  getPoolsQuery(isFirstQuery) {
    const {
      loadActiveAmpUpdates,
      loadActiveWeightUpdates,
      gqlAdditionalPoolQueryFields
    } = this.config;
    const blockNumberFragment = `
            _meta {
                block {
                    number
                }
            }
        `;
    const ampUpdatesFragment = `
            ampUpdates(where: $ampUpdatesWhere) {
                poolId {
                    id
                }
            }
        `;
    const weightUpdatesFragment = `
            gradualWeightUpdates(where: $weightedUpdatesWhere) {
                poolId {
                    id
                }
            }
        `;
    return `
            query poolsQuery(
                $pageSize: Int!
                $where: Pool_filter
                $block: Block_height
                $ampUpdatesWhere: AmpUpdate_filter
                $weightedUpdatesWhere: GradualWeightUpdate_filter
            ) {
                pools(first: $pageSize, where: $where, block: $block) {
                    id
                    address
                    poolType
                    poolTypeVersion
                    tokens {
                        address
                        balance
                        weight
                        priceRate
                        decimals
                        name
                        index
                        symbol
                    }
                    tokensList
                    swapEnabled
                    swapFee
                    amp
                    totalLiquidity
                    totalShares
                    mainIndex
                    wrappedIndex
                    lowerTarget
                    upperTarget
                    ${gqlAdditionalPoolQueryFields || ""}
                }
                ${isFirstQuery ? blockNumberFragment : ""}
                ${isFirstQuery && loadActiveAmpUpdates ? ampUpdatesFragment : ""}
                ${isFirstQuery && loadActiveWeightUpdates ? weightUpdatesFragment : ""}
            }
        `;
  }
  poolMatchesFilter(pool) {
    if (!pool.swapEnabled || pool.totalShares === "0.000000000001" || pool.totalShares === "0") {
      return false;
    }
    if (this.config.poolTypeIn && !this.config.poolTypeIn.includes(pool.poolType)) {
      return false;
    }
    if (this.config.poolTypeNotIn?.includes(pool.poolType)) {
      return false;
    }
    if (this.config.poolIdIn && !this.config.poolIdIn.includes(pool.id)) {
      return false;
    }
    if (this.config.poolIdNotIn?.includes(pool.id)) {
      return false;
    }
    return true;
  }
};

// src/utils/logger.ts
import pino from "pino";
var LOG_LEVEL = process.env.LOG_LEVEL || "info";
var logger = pino({
  formatters: {
    level(level) {
      return { level };
    }
  },
  base: void 0,
  level: LOG_LEVEL
});

// src/pathGraph/pathGraph.ts
var DEFAULT_MAX_PATHS_PER_TOKEN_PAIR = 2;
var PathGraph = class {
  constructor() {
    __publicField(this, "nodes");
    __publicField(this, "edges");
    __publicField(this, "poolAddressMap");
    __publicField(this, "maxPathsPerTokenPair", DEFAULT_MAX_PATHS_PER_TOKEN_PAIR);
    this.nodes = /* @__PURE__ */ new Map();
    this.edges = /* @__PURE__ */ new Map();
    this.poolAddressMap = /* @__PURE__ */ new Map();
  }
  // We build a directed graph for all pools.
  // Nodes are tokens and edges are triads: [pool.id, tokenIn, tokenOut].
  // The current criterion for including a pool path into this graph is the following:
  // (a) We include every path that includes a phantom BPT.
  // (b) For any token pair x -> y, we include only the most liquid ${maxPathsPerTokenPair}
  // pool pairs (default 2).
  buildGraph({
    pools,
    maxPathsPerTokenPair = DEFAULT_MAX_PATHS_PER_TOKEN_PAIR
  }) {
    this.poolAddressMap = /* @__PURE__ */ new Map();
    this.nodes = /* @__PURE__ */ new Map();
    this.edges = /* @__PURE__ */ new Map();
    this.maxPathsPerTokenPair = maxPathsPerTokenPair;
    this.buildPoolAddressMap(pools);
    this.addAllTokensAsGraphNodes(pools);
    this.addTokenPairsAsGraphEdges({ pools, maxPathsPerTokenPair });
  }
  // Since the path combinations here can get quite large, we use configurable parameters
  // to enforce upper limits across several dimensions, defined in the pathConfig.
  // (a) maxDepth - the max depth of the traversal (length of token path), defaults to 7.
  // (b) maxNonBoostedPathDepth - the max depth for any path that does not contain a phantom bpt.
  // (c) maxNonBoostedHopTokensInBoostedPath - The max number of non boosted hop tokens
  // allowed in a boosted path.
  // (d) approxPathsToReturn - search for up to this many paths. Since all paths for a single traversal
  // are added, its possible that the amount returned is larger than this number.
  // (e) poolIdsToInclude - Only include paths with these poolIds (optional)
  // Additionally, we impose the following requirements for a path to be considered valid
  // (a) It does not visit the same token twice
  // (b) It does not use the same pool twice
  getCandidatePaths({
    tokenIn,
    tokenOut,
    graphTraversalConfig
  }) {
    const config = {
      maxDepth: 6,
      maxNonBoostedPathDepth: 3,
      maxNonBoostedHopTokensInBoostedPath: 2,
      approxPathsToReturn: 5,
      ...graphTraversalConfig
    };
    const tokenPaths = this.findAllValidTokenPaths({
      token: tokenIn.wrapped,
      tokenIn: tokenIn.wrapped,
      tokenOut: tokenOut.wrapped,
      config,
      tokenPath: [tokenIn.wrapped]
    }).sort((a, b) => a.length < b.length ? -1 : 1);
    const paths = [];
    const selectedPathIds = [];
    for (let idx = 0; idx < this.maxPathsPerTokenPair; idx++) {
      for (let i = 0; i < tokenPaths.length; i++) {
        const path = this.expandTokenPath({
          tokenPath: tokenPaths[i],
          tokenPairIndex: idx
        });
        if (this.isValidPath({
          path,
          seenPoolAddresses: [],
          selectedPathIds,
          config
        })) {
          selectedPathIds.push(this.getIdForPath(path));
          paths.push(path);
        }
      }
      if (paths.length >= config.approxPathsToReturn) {
        break;
      }
    }
    return this.sortAndFilterPaths(paths).map((path) => {
      const pathTokens = [
        ...path.map((segment) => segment.tokenOut)
      ];
      pathTokens.unshift(tokenIn);
      pathTokens[pathTokens.length - 1] = tokenOut;
      return {
        tokens: pathTokens,
        pools: path.map((segment) => segment.pool)
      };
    });
  }
  sortAndFilterPaths(paths) {
    const pathsWithLimits = paths.map((path) => {
      const limit = this.getLimitAmountSwapForPath(
        path,
        0 /* GivenIn */
      );
      return { path, limit };
    }).sort((a, b) => a.limit < b.limit ? 1 : -1);
    const filtered = [];
    for (const { path } of pathsWithLimits) {
      let seenPools = [];
      let isValid = true;
      for (const segment of path) {
        if (seenPools.includes(segment.pool.id)) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        filtered.push(path);
        seenPools = [
          ...seenPools,
          ...path.map((segment) => segment.pool.id)
        ];
      }
    }
    return filtered;
  }
  buildPoolAddressMap(pools) {
    for (const pool of pools) {
      this.poolAddressMap.set(pool.address, pool);
    }
  }
  addAllTokensAsGraphNodes(pools) {
    for (const pool of pools) {
      for (const tokenAmount of pool.tokens) {
        const token = tokenAmount.token;
        if (!this.nodes.has(token.wrapped)) {
          this.addNode(token);
        }
      }
    }
  }
  addTokenPairsAsGraphEdges({
    pools,
    maxPathsPerTokenPair
  }) {
    for (const pool of pools) {
      for (let i = 0; i < pool.tokens.length - 1; i++) {
        for (let j = i + 1; j < pool.tokens.length; j++) {
          const tokenI = pool.tokens[i].token;
          const tokenJ = pool.tokens[j].token;
          this.addEdge({
            edgeProps: {
              pool,
              tokenIn: tokenI,
              tokenOut: tokenJ,
              normalizedLiquidity: pool.getNormalizedLiquidity(
                tokenI,
                tokenJ
              )
            },
            maxPathsPerTokenPair
          });
          this.addEdge({
            edgeProps: {
              pool,
              tokenIn: tokenJ,
              tokenOut: tokenI,
              normalizedLiquidity: pool.getNormalizedLiquidity(
                tokenJ,
                tokenI
              )
            },
            maxPathsPerTokenPair
          });
        }
      }
    }
  }
  addNode(token) {
    this.nodes.set(token.wrapped, {
      isPhantomBpt: !!this.poolAddressMap[token.wrapped]
    });
    if (!this.edges.has(token.wrapped)) {
      this.edges.set(token.wrapped, /* @__PURE__ */ new Map());
    }
  }
  /**
   * Returns the vertices connected to a given vertex
   */
  getConnectedVertices(tokenAddress) {
    const result = [];
    const edges = this.edges.get(tokenAddress) || [];
    for (const [otherToken] of edges) {
      result.push(otherToken);
    }
    return result;
  }
  /**
   * Adds a directed edge from a source vertex to a destination
   */
  addEdge({
    edgeProps,
    maxPathsPerTokenPair
  }) {
    const tokenInVertex = this.nodes.get(edgeProps.tokenIn.wrapped);
    const tokenOutVertex = this.nodes.get(edgeProps.tokenOut.wrapped);
    const tokenInNode = this.edges.get(edgeProps.tokenIn.wrapped);
    if (!tokenInVertex || !tokenOutVertex || !tokenInNode) {
      throw new Error("Attempting to add invalid edge");
    }
    const hasPhantomBpt = tokenInVertex.isPhantomBpt || tokenOutVertex.isPhantomBpt;
    const existingEdges = tokenInNode.get(edgeProps.tokenOut.wrapped) || [];
    const sorted = [...existingEdges, edgeProps].sort(
      (a, b) => a.normalizedLiquidity > b.normalizedLiquidity ? -1 : 1
    );
    tokenInNode.set(
      edgeProps.tokenOut.wrapped,
      sorted.length > maxPathsPerTokenPair && !hasPhantomBpt ? sorted.slice(0, 2) : sorted
    );
  }
  findAllValidTokenPaths(args) {
    const tokenPaths = [];
    this.traverseBfs({
      ...args,
      callback: (tokenPath) => {
        tokenPaths.push(tokenPath);
      }
    });
    return tokenPaths;
  }
  expandTokenPath({
    tokenPath,
    tokenPairIndex
  }) {
    const segments = [];
    for (let i = 0; i < tokenPath.length - 1; i++) {
      const edge = this.edges.get(tokenPath[i])?.get(tokenPath[i + 1]);
      if (!edge || edge.length === 0) {
        throw new Error(
          `Missing edge for pair ${tokenPath[i]} -> ${tokenPath[i + 1]}`
        );
      }
      segments.push(edge[tokenPairIndex] || edge[0]);
    }
    return segments;
  }
  traverseBfs({
    token,
    tokenIn,
    tokenOut,
    tokenPath,
    callback,
    config
  }) {
    const neighbors = this.getConnectedVertices(token);
    for (const neighbor of neighbors) {
      const validTokenPath = this.isValidTokenPath({
        tokenPath: [...tokenPath, neighbor],
        tokenIn,
        tokenOut,
        config
      });
      if (validTokenPath && neighbor === tokenOut) {
        callback([...tokenPath, neighbor]);
      } else if (validTokenPath && !tokenPath.includes(neighbor)) {
        this.traverseBfs({
          tokenPath: [...tokenPath, neighbor],
          token: neighbor,
          tokenIn,
          tokenOut,
          callback,
          config
        });
      }
    }
  }
  isValidTokenPath({
    tokenPath,
    config,
    tokenIn,
    tokenOut
  }) {
    const isCompletePath = tokenPath[tokenPath.length - 1] === tokenOut;
    const hopTokens = tokenPath.filter(
      (token) => token !== tokenIn && token !== tokenOut
    );
    const numStandardHopTokens = hopTokens.filter(
      (token) => !this.poolAddressMap.has(token)
    ).length;
    const isBoostedPath = tokenPath.filter((token) => this.poolAddressMap.has(token)).length > 0;
    if (tokenPath.length > config.maxDepth) {
      return false;
    }
    if (isBoostedPath && numStandardHopTokens > config.maxNonBoostedHopTokensInBoostedPath) {
      return false;
    }
    if (tokenPath.length > config.maxNonBoostedPathDepth && numStandardHopTokens > config.maxNonBoostedHopTokensInBoostedPath) {
      return false;
    }
    if (isCompletePath && !isBoostedPath && tokenPath.length > config.maxNonBoostedPathDepth) {
      return false;
    }
    return true;
  }
  isValidPath({
    path,
    seenPoolAddresses,
    selectedPathIds,
    config
  }) {
    const poolIdsInPath = path.map((segment) => segment.pool.id);
    const uniquePools = [...new Set(poolIdsInPath)];
    if (config.poolIdsToInclude) {
      for (const poolId of poolIdsInPath) {
        if (!config.poolIdsToInclude.includes(poolId)) {
          return false;
        }
      }
    }
    if (uniquePools.length !== poolIdsInPath.length) {
      return false;
    }
    for (const segment of path) {
      if (seenPoolAddresses.includes(segment.pool.address)) {
        return false;
      }
    }
    if (selectedPathIds.includes(this.getIdForPath(path))) {
      return false;
    }
    return true;
  }
  getIdForPath(path) {
    let id = "";
    for (const segment of path) {
      if (id.length > 0) {
        id += "_";
      }
      id += `${segment.pool.id}-${segment.tokenIn}-${segment.tokenOut}`;
    }
    return id;
  }
  filterVolatilePools(poolAddresses) {
    const filtered = [];
    for (const poolAddress of poolAddresses) {
      if (this.poolAddressMap.get(poolAddress)?.poolType === "Weighted" /* Weighted */) {
        filtered.push(poolAddress);
      }
    }
    return filtered;
  }
  getLimitAmountSwapForPath(path, swapKind) {
    let limit = path[path.length - 1].pool.getLimitAmountSwap(
      path[path.length - 1].tokenIn,
      path[path.length - 1].tokenOut,
      swapKind
    );
    for (let i = path.length - 2; i >= 0; i--) {
      const poolLimitExactIn = path[i].pool.getLimitAmountSwap(
        path[i].tokenIn,
        path[i].tokenOut,
        0 /* GivenIn */
      );
      const poolLimitExactOut = path[i].pool.getLimitAmountSwap(
        path[i].tokenIn,
        path[i].tokenOut,
        1 /* GivenOut */
      );
      if (poolLimitExactOut <= limit) {
        limit = poolLimitExactIn;
      } else {
        const pulledLimit = path[i].pool.swapGivenOut(
          path[i].tokenIn,
          path[i].tokenOut,
          TokenAmount.fromRawAmount(path[i].tokenOut, limit)
        ).amount;
        limit = pulledLimit > poolLimitExactIn ? poolLimitExactIn : pulledLimit;
      }
    }
    return limit;
  }
};

// src/router.ts
var Router = class {
  constructor() {
    __publicField(this, "pathGraph");
    this.pathGraph = new PathGraph();
  }
  getCandidatePaths(tokenIn, tokenOut, pools, graphTraversalConfig) {
    this.pathGraph.buildGraph({ pools });
    const candidatePaths = this.pathGraph.getCandidatePaths({
      tokenIn,
      tokenOut,
      graphTraversalConfig
    });
    return candidatePaths;
  }
  getBestPaths(paths, swapKind, swapAmount) {
    if (paths.length === 0) {
      throw new Error("No potential swap paths provided");
    }
    const quotePaths = [];
    paths.forEach((path) => {
      try {
        quotePaths.push(
          new PathWithAmount(path.tokens, path.pools, swapAmount)
        );
      } catch {
        logger.trace("Invalid path:");
        logger.trace(
          path.tokens.map((token) => token.symbol).join(" -> ")
        );
        logger.trace(path.pools.map((pool) => pool.id).join(" -> "));
        return;
      }
    });
    if (quotePaths.length === 0) {
      logger.info("No valid paths found");
      return null;
    }
    let valueArr;
    if (swapKind === 0 /* GivenIn */) {
      valueArr = quotePaths.map((item) => {
        return {
          item,
          value: Number(item.outputAmount.amount)
        };
      }), valueArr.sort((a, b) => b.value - a.value);
    } else {
      valueArr = quotePaths.map((item) => {
        return {
          item,
          value: Number(item.inputAmount.amount)
        };
      }), valueArr.sort((a, b) => a.value - b.value);
    }
    const orderedQuotePaths = valueArr.map((item) => item.item);
    if (orderedQuotePaths.length === 1) {
      return orderedQuotePaths;
    }
    const swapAmount50up = swapAmount.mulDownFixed(WAD / 2n);
    const swapAmount50down = swapAmount.sub(swapAmount50up);
    const path50up = new PathWithAmount(
      orderedQuotePaths[0].tokens,
      orderedQuotePaths[0].pools,
      swapAmount50up
    );
    const path50down = new PathWithAmount(
      orderedQuotePaths[1].tokens,
      orderedQuotePaths[1].pools,
      swapAmount50down
    );
    if (swapKind === 0 /* GivenIn */) {
      if (orderedQuotePaths[0].outputAmount.amount > path50up.outputAmount.amount + path50down.outputAmount.amount) {
        return orderedQuotePaths.slice(0, 1);
      } else {
        return [path50up, path50down];
      }
    } else {
      if (orderedQuotePaths[0].inputAmount.amount < path50up.inputAmount.amount + path50down.inputAmount.amount) {
        return orderedQuotePaths.slice(0, 1);
      } else {
        return [path50up, path50down];
      }
    }
  }
};

// src/entities/pools/weighted/weightedFactory.ts
var WeightedPoolFactory = class {
  isPoolForFactory(pool) {
    return pool.poolType === "Weighted";
  }
  create(chainId, pool) {
    return WeightedPool.fromRawPool(chainId, pool);
  }
};

// src/entities/pools/weighted/weightedPool.ts
import { parseEther } from "viem";

// src/entities/pools/weighted/weightedMath.ts
function _calcOutGivenIn(balanceIn, weightIn, balanceOut, weightOut, amountIn, version) {
  const denominator = balanceIn + amountIn;
  const base = MathSol.divUpFixed(balanceIn, denominator);
  const exponent = MathSol.divDownFixed(weightIn, weightOut);
  const power = MathSol.powUpFixed(base, exponent, version);
  return MathSol.mulDownFixed(balanceOut, MathSol.complementFixed(power));
}
function _calcInGivenOut(balanceIn, weightIn, balanceOut, weightOut, amountOut, version) {
  const base = MathSol.divUpFixed(balanceOut, balanceOut - amountOut);
  const exponent = MathSol.divUpFixed(weightOut, weightIn);
  const power = MathSol.powUpFixed(base, exponent, version);
  const ratio = power - WAD;
  return MathSol.mulUpFixed(balanceIn, ratio);
}

// src/entities/pools/weighted/weightedPool.ts
var WeightedPoolToken = class extends TokenAmount {
  constructor(token, amount, weight, index) {
    super(token, amount);
    __publicField(this, "weight");
    __publicField(this, "index");
    this.weight = BigInt(weight);
    this.index = index;
  }
  increase(amount) {
    this.amount = this.amount + amount;
    this.scale18 = this.amount * this.scalar;
    return this;
  }
  decrease(amount) {
    this.amount = this.amount - amount;
    this.scale18 = this.amount * this.scalar;
    return this;
  }
};
var WeightedPool = class {
  constructor(id, poolTypeVersion, swapFee, tokens) {
    __publicField(this, "chainId");
    __publicField(this, "id");
    __publicField(this, "address");
    __publicField(this, "poolType", "Weighted" /* Weighted */);
    __publicField(this, "poolTypeVersion");
    __publicField(this, "swapFee");
    __publicField(this, "tokens");
    __publicField(this, "tokenMap");
    __publicField(this, "MAX_IN_RATIO", 300000000000000000n);
    // 0.3
    __publicField(this, "MAX_OUT_RATIO", 300000000000000000n);
    this.chainId = tokens[0].token.chainId;
    this.id = id;
    this.poolTypeVersion = poolTypeVersion;
    this.address = getPoolAddress(id);
    this.swapFee = swapFee;
    this.tokens = tokens;
    this.tokenMap = new Map(
      tokens.map((token) => [token.token.address, token])
    );
  }
  // 0.3
  static fromRawPool(chainId, pool) {
    const poolTokens = [];
    for (const t of pool.tokens) {
      if (!t.weight) {
        throw new Error("Weighted pool token does not have a weight");
      }
      const token = new Token(
        chainId,
        t.address,
        t.decimals,
        t.symbol,
        t.name
      );
      const tokenAmount = TokenAmount.fromHumanAmount(token, t.balance);
      poolTokens.push(
        new WeightedPoolToken(
          token,
          tokenAmount.amount,
          parseEther(t.weight),
          t.index
        )
      );
    }
    return new WeightedPool(
      pool.id,
      pool.poolTypeVersion,
      parseEther(pool.swapFee),
      poolTokens
    );
  }
  getNormalizedLiquidity(tokenIn, tokenOut) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    return tIn.amount * tOut.weight / (tIn.weight + tOut.weight);
  }
  getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    if (swapKind === 0 /* GivenIn */) {
      return tIn.amount * this.MAX_IN_RATIO / WAD;
    } else {
      return tOut.amount * this.MAX_OUT_RATIO / WAD;
    }
  }
  swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    if (swapAmount.amount > this.getLimitAmountSwap(tokenIn, tokenOut, 0 /* GivenIn */)) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const amountWithFee = this.subtractSwapFeeAmount(swapAmount);
    const tokenOutScale18 = _calcOutGivenIn(
      tIn.scale18,
      tIn.weight,
      tOut.scale18,
      tOut.weight,
      amountWithFee.scale18,
      this.poolTypeVersion
    );
    const tokenOutAmount = TokenAmount.fromScale18Amount(
      tokenOut,
      tokenOutScale18
    );
    if (mutateBalances) {
      tIn.increase(swapAmount.amount);
      tOut.decrease(tokenOutAmount.amount);
    }
    return tokenOutAmount;
  }
  swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    if (swapAmount.amount > this.getLimitAmountSwap(tokenIn, tokenOut, 1 /* GivenOut */)) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const tokenInScale18 = _calcInGivenOut(
      tIn.scale18,
      tIn.weight,
      tOut.scale18,
      tOut.weight,
      swapAmount.scale18,
      this.poolTypeVersion
    );
    const tokenInAmount = this.addSwapFeeAmount(
      TokenAmount.fromScale18Amount(tokenIn, tokenInScale18, true)
    );
    if (mutateBalances) {
      tIn.increase(tokenInAmount.amount);
      tOut.decrease(swapAmount.amount);
    }
    return tokenInAmount;
  }
  subtractSwapFeeAmount(amount) {
    const feeAmount = amount.mulUpFixed(this.swapFee);
    return amount.sub(feeAmount);
  }
  addSwapFeeAmount(amount) {
    return amount.divUpFixed(MathSol.complementFixed(this.swapFee));
  }
  getRequiredTokenPair(tokenIn, tokenOut) {
    const tIn = this.tokenMap.get(tokenIn.wrapped);
    const tOut = this.tokenMap.get(tokenOut.wrapped);
    if (!tIn || !tOut) {
      throw new Error("Pool does not contain the tokens provided");
    }
    return { tIn, tOut };
  }
};

// src/entities/pools/stable/stableFactory.ts
var StablePoolFactory = class {
  isPoolForFactory(pool) {
    return pool.poolType === "ComposableStable";
  }
  create(chainId, pool) {
    return StablePool.fromRawPool(chainId, pool);
  }
};

// src/entities/pools/stable/stablePool.ts
import { parseEther as parseEther2 } from "viem";

// src/entities/pools/stable/stableMath.ts
var AMP_PRECISION = 1000n;
function _calculateInvariant(amplificationParameter, balances, roundUp) {
  let sum = 0n;
  const numTokens = balances.length;
  for (let i = 0; i < numTokens; i++) {
    sum += balances[i];
  }
  if (sum === 0n) {
    return 0n;
  }
  let prevInvariant;
  let invariant = sum;
  const ampTimesTotal = amplificationParameter * BigInt(numTokens);
  for (let i = 0; i < 255; i++) {
    let D_P = invariant;
    for (let j = 0; j < numTokens; j++) {
      D_P = roundUp ? MathSol.divUp(
        D_P * invariant,
        balances[j] * BigInt(numTokens)
      ) : D_P * invariant / (balances[j] * BigInt(numTokens));
    }
    prevInvariant = invariant;
    invariant = roundUp ? MathSol.divUp(
      (ampTimesTotal * sum / AMP_PRECISION + D_P * BigInt(numTokens)) * invariant,
      MathSol.divUp(
        (ampTimesTotal - AMP_PRECISION) * invariant,
        AMP_PRECISION
      ) + (BigInt(numTokens) + 1n) * D_P
    ) : (ampTimesTotal * sum / AMP_PRECISION + D_P * BigInt(numTokens)) * invariant / ((ampTimesTotal - AMP_PRECISION) * invariant / AMP_PRECISION + (BigInt(numTokens) + 1n) * D_P);
    if (invariant > prevInvariant) {
      if (invariant - prevInvariant <= 1n) {
        return invariant;
      }
    } else if (prevInvariant - invariant <= 1n) {
      return invariant;
    }
  }
  throw new Error("Errors.STABLE_INVARIANT_DIDNT_CONVERGE");
}
function _calcOutGivenIn2(amplificationParameter, balances, tokenIndexIn, tokenIndexOut, tokenAmountIn, invariant) {
  balances[tokenIndexIn] = balances[tokenIndexIn] + tokenAmountIn;
  const finalBalanceOut = _getTokenBalanceGivenInvariantAndAllOtherBalances(
    amplificationParameter,
    balances,
    invariant,
    tokenIndexOut
  );
  balances[tokenIndexIn] = balances[tokenIndexIn] - tokenAmountIn;
  return balances[tokenIndexOut] - finalBalanceOut - 1n;
}
function _calcInGivenOut2(amplificationParameter, balances, tokenIndexIn, tokenIndexOut, tokenAmountOut, invariant) {
  balances[tokenIndexOut] = balances[tokenIndexOut] - tokenAmountOut;
  const finalBalanceIn = _getTokenBalanceGivenInvariantAndAllOtherBalances(
    amplificationParameter,
    balances,
    invariant,
    tokenIndexIn
  );
  balances[tokenIndexOut] = balances[tokenIndexOut] - tokenAmountOut;
  return finalBalanceIn - balances[tokenIndexIn] + 1n;
}
function _calcBptOutGivenExactTokensIn(amp, balances, amountsIn, bptTotalSupply, currentInvariant, swapFee) {
  let sumBalances = 0n;
  for (let i = 0; i < balances.length; i++) {
    sumBalances += balances[i];
  }
  const balanceRatiosWithFee = new Array(amountsIn.length);
  let invariantRatioWithFees = 0n;
  for (let i = 0; i < balances.length; i++) {
    const currentWeight = MathSol.divDownFixed(balances[i], sumBalances);
    balanceRatiosWithFee[i] = MathSol.divDownFixed(
      balances[i] + amountsIn[i],
      balances[i]
    );
    invariantRatioWithFees = invariantRatioWithFees + MathSol.mulDownFixed(balanceRatiosWithFee[i], currentWeight);
  }
  const newBalances = new Array(balances.length);
  for (let i = 0; i < balances.length; i++) {
    let amountInWithoutFee;
    if (balanceRatiosWithFee[i] > invariantRatioWithFees) {
      const nonTaxableAmount = MathSol.mulDownFixed(
        balances[i],
        invariantRatioWithFees - WAD
      );
      const taxableAmount = amountsIn[i] - nonTaxableAmount;
      amountInWithoutFee = nonTaxableAmount + MathSol.mulDownFixed(taxableAmount, WAD - swapFee);
    } else {
      amountInWithoutFee = amountsIn[i];
    }
    newBalances[i] = balances[i] + amountInWithoutFee;
  }
  const newInvariant = _calculateInvariant(amp, newBalances);
  const invariantRatio = MathSol.divDownFixed(newInvariant, currentInvariant);
  if (invariantRatio > WAD) {
    return MathSol.mulDownFixed(bptTotalSupply, invariantRatio - WAD);
  } else {
    return 0n;
  }
}
function _calcTokenInGivenExactBptOut(amp, balances, tokenIndex, bptAmountOut, bptTotalSupply, currentInvariant, swapFee) {
  const newInvariant = MathSol.mulUpFixed(
    MathSol.divUpFixed(bptTotalSupply + bptAmountOut, bptTotalSupply),
    currentInvariant
  );
  const newBalanceTokenIndex = _getTokenBalanceGivenInvariantAndAllOtherBalances(
    amp,
    balances,
    newInvariant,
    tokenIndex
  );
  const amountInWithoutFee = newBalanceTokenIndex - balances[tokenIndex];
  let sumBalances = 0n;
  for (let i = 0; i < balances.length; i++) {
    sumBalances += balances[i];
  }
  const currentWeight = MathSol.divDownFixed(
    balances[tokenIndex],
    sumBalances
  );
  const taxablePercentage = MathSol.complementFixed(currentWeight);
  const taxableAmount = MathSol.mulUpFixed(
    amountInWithoutFee,
    taxablePercentage
  );
  const nonTaxableAmount = amountInWithoutFee - taxableAmount;
  return nonTaxableAmount + MathSol.divUpFixed(taxableAmount, WAD - swapFee);
}
function _calcBptInGivenExactTokensOut(amp, balances, amountsOut, bptTotalSupply, currentInvariant, swapFee) {
  let sumBalances = 0n;
  for (let i = 0; i < balances.length; i++) {
    sumBalances += balances[i];
  }
  const balanceRatiosWithoutFee = new Array(amountsOut.length);
  let invariantRatioWithoutFees = 0n;
  for (let i = 0; i < balances.length; i++) {
    const currentWeight = MathSol.divUpFixed(balances[i], sumBalances);
    balanceRatiosWithoutFee[i] = MathSol.divUpFixed(
      balances[i] - amountsOut[i],
      balances[i]
    );
    invariantRatioWithoutFees += MathSol.mulUpFixed(
      balanceRatiosWithoutFee[i],
      currentWeight
    );
  }
  const newBalances = new Array(balances.length);
  for (let i = 0; i < balances.length; i++) {
    let amountOutWithFee;
    if (invariantRatioWithoutFees > balanceRatiosWithoutFee[i]) {
      const nonTaxableAmount = MathSol.mulDownFixed(
        balances[i],
        MathSol.complementFixed(invariantRatioWithoutFees)
      );
      const taxableAmount = amountsOut[i] - nonTaxableAmount;
      amountOutWithFee = nonTaxableAmount + MathSol.divUpFixed(taxableAmount, WAD - swapFee);
    } else {
      amountOutWithFee = amountsOut[i];
    }
    newBalances[i] = balances[i] - amountOutWithFee;
  }
  const newInvariant = _calculateInvariant(amp, newBalances);
  const invariantRatio = MathSol.divDownFixed(newInvariant, currentInvariant);
  return MathSol.mulUpFixed(
    bptTotalSupply,
    MathSol.complementFixed(invariantRatio)
  );
}
function _calcTokenOutGivenExactBptIn(amp, balances, tokenIndex, bptAmountIn, bptTotalSupply, currentInvariant, swapFee) {
  const newInvariant = MathSol.mulUpFixed(
    MathSol.divUpFixed(bptTotalSupply - bptAmountIn, bptTotalSupply),
    currentInvariant
  );
  const newBalanceTokenIndex = _getTokenBalanceGivenInvariantAndAllOtherBalances(
    amp,
    balances,
    newInvariant,
    tokenIndex
  );
  const amountOutWithoutFee = balances[tokenIndex] - newBalanceTokenIndex;
  let sumBalances = 0n;
  for (let i = 0; i < balances.length; i++) {
    sumBalances += balances[i];
  }
  const currentWeight = MathSol.divDownFixed(
    balances[tokenIndex],
    sumBalances
  );
  const taxablePercentage = MathSol.complementFixed(currentWeight);
  const taxableAmount = MathSol.mulUpFixed(
    amountOutWithoutFee,
    taxablePercentage
  );
  const nonTaxableAmount = amountOutWithoutFee - taxableAmount;
  return nonTaxableAmount + MathSol.mulDownFixed(taxableAmount, WAD - swapFee);
}
function _getTokenBalanceGivenInvariantAndAllOtherBalances(amplificationParameter, balances, invariant, tokenIndex) {
  const ampTimesTotal = amplificationParameter * BigInt(balances.length);
  let sum = balances[0];
  let P_D = balances[0] * BigInt(balances.length);
  for (let j = 1; j < balances.length; j++) {
    P_D = P_D * balances[j] * BigInt(balances.length) / invariant;
    sum += balances[j];
  }
  sum = sum - balances[tokenIndex];
  const inv2 = invariant * invariant;
  const c = MathSol.divUp(inv2, ampTimesTotal * P_D) * AMP_PRECISION * balances[tokenIndex];
  const b = sum + invariant / ampTimesTotal * AMP_PRECISION;
  let prevTokenBalance = 0n;
  let tokenBalance = MathSol.divUp(inv2 + c, invariant + b);
  for (let i = 0; i < 255; i++) {
    prevTokenBalance = tokenBalance;
    tokenBalance = MathSol.divUp(
      tokenBalance * tokenBalance + c,
      tokenBalance * 2n + b - invariant
    );
    if (tokenBalance > prevTokenBalance) {
      if (tokenBalance - prevTokenBalance <= 1n) {
        return tokenBalance;
      }
    } else if (prevTokenBalance - tokenBalance <= 1n) {
      return tokenBalance;
    }
  }
  throw new Error("Errors.STABLE_GET_BALANCE_DIDNT_CONVERGE");
}

// src/entities/pools/stable/stablePool.ts
var StablePoolToken = class extends TokenAmount {
  constructor(token, amount, rate, index) {
    super(token, amount);
    __publicField(this, "rate");
    __publicField(this, "index");
    __publicField(this, "scale18");
    this.rate = BigInt(rate);
    this.scale18 = this.amount * this.scalar * this.rate / WAD;
    this.index = index;
  }
  increase(amount) {
    this.amount = this.amount + amount;
    this.scale18 = this.amount * this.scalar * this.rate / WAD;
    return this;
  }
  decrease(amount) {
    this.amount = this.amount - amount;
    this.scale18 = this.amount * this.scalar * this.rate / WAD;
    return this;
  }
};
var StablePool = class {
  constructor(id, amp, swapFee, tokens, totalShares) {
    __publicField(this, "chainId");
    __publicField(this, "id");
    __publicField(this, "address");
    __publicField(this, "poolType", "ComposableStable" /* ComposableStable */);
    __publicField(this, "amp");
    __publicField(this, "swapFee");
    __publicField(this, "bptIndex");
    __publicField(this, "totalShares");
    __publicField(this, "tokens");
    __publicField(this, "tokenMap");
    __publicField(this, "tokenIndexMap");
    this.chainId = tokens[0].token.chainId;
    this.id = id;
    this.address = getPoolAddress(id);
    this.amp = amp;
    this.swapFee = swapFee;
    this.totalShares = totalShares;
    this.tokens = tokens.sort((a, b) => a.index - b.index);
    this.tokenMap = new Map(
      this.tokens.map((token) => [token.token.address, token])
    );
    this.tokenIndexMap = new Map(
      this.tokens.map((token) => [token.token.address, token.index])
    );
    this.bptIndex = this.tokens.findIndex(
      (t) => t.token.address === this.address
    );
  }
  static fromRawPool(chainId, pool) {
    const poolTokens = [];
    for (const t of pool.tokens) {
      if (!t.priceRate)
        throw new Error("Stable pool token does not have a price rate");
      const token = new Token(
        chainId,
        t.address,
        t.decimals,
        t.symbol,
        t.name
      );
      const tokenAmount = TokenAmount.fromHumanAmount(token, t.balance);
      const tokenIndex = t.index ?? pool.tokensList.findIndex((t2) => t2 === token.address);
      poolTokens.push(
        new StablePoolToken(
          token,
          tokenAmount.amount,
          parseEther2(t.priceRate),
          tokenIndex
        )
      );
    }
    const totalShares = parseEther2(pool.totalShares);
    const amp = BigInt(pool.amp) * 1000n;
    return new StablePool(
      pool.id,
      amp,
      parseEther2(pool.swapFee),
      poolTokens,
      totalShares
    );
  }
  getNormalizedLiquidity(tokenIn, tokenOut) {
    const tIn = this.tokenMap.get(tokenIn.wrapped);
    const tOut = this.tokenMap.get(tokenOut.wrapped);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    return tOut.amount * this.amp;
  }
  swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const tInIndex = this.tokenIndexMap.get(tokenIn.wrapped);
    const tOutIndex = this.tokenIndexMap.get(tokenOut.wrapped);
    if (typeof tInIndex !== "number" || typeof tOutIndex !== "number") {
      throw new Error("Pool does not contain the tokens provided");
    }
    const balancesNoBpt = this.dropBptItem(
      this.tokens.map((t) => t.scale18)
    );
    if (swapAmount.scale18 > this.tokens[tInIndex].scale18) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const invariant = _calculateInvariant(this.amp, balancesNoBpt);
    let tokenOutScale18;
    if (tokenIn.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
      const amountInWithRate = swapAmount.mulDownFixed(
        this.tokens[tInIndex].rate
      );
      tokenOutScale18 = _calcTokenOutGivenExactBptIn(
        this.amp,
        [...balancesNoBpt],
        this.skipBptIndex(tOutIndex),
        amountInWithRate.scale18,
        this.totalShares,
        invariant,
        this.swapFee
      );
    } else if (tokenOut.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
      const amountsIn = new Array(balancesNoBpt.length).fill(0n);
      const amountInWithRate = swapAmount.mulDownFixed(
        this.tokens[tInIndex].rate
      );
      amountsIn[this.skipBptIndex(tInIndex)] = amountInWithRate.scale18;
      tokenOutScale18 = _calcBptOutGivenExactTokensIn(
        this.amp,
        [...balancesNoBpt],
        amountsIn,
        this.totalShares,
        invariant,
        this.swapFee
      );
    } else {
      const amountInWithFee = this.subtractSwapFeeAmount(swapAmount);
      const amountInWithRate = amountInWithFee.mulDownFixed(
        this.tokens[tInIndex].rate
      );
      tokenOutScale18 = _calcOutGivenIn2(
        this.amp,
        [...balancesNoBpt],
        this.skipBptIndex(tInIndex),
        this.skipBptIndex(tOutIndex),
        amountInWithRate.scale18,
        invariant
      );
    }
    const amountOut = TokenAmount.fromScale18Amount(
      tokenOut,
      tokenOutScale18
    );
    const amountOutWithRate = amountOut.divDownFixed(
      this.tokens[tOutIndex].rate
    );
    if (amountOutWithRate.amount < 0n)
      throw new Error("Swap output negative");
    if (mutateBalances) {
      this.tokens[tInIndex].increase(swapAmount.amount);
      this.tokens[tOutIndex].decrease(amountOutWithRate.amount);
      if (tInIndex === this.bptIndex) {
        this.totalShares = this.totalShares - swapAmount.amount;
      } else if (tOutIndex === this.bptIndex) {
        this.totalShares = this.totalShares + amountOutWithRate.amount;
      }
    }
    return amountOutWithRate;
  }
  swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const tInIndex = this.tokenIndexMap.get(tokenIn.wrapped);
    const tOutIndex = this.tokenIndexMap.get(tokenOut.wrapped);
    if (typeof tInIndex !== "number" || typeof tOutIndex !== "number") {
      throw new Error("Pool does not contain the tokens provided");
    }
    const balancesNoBpt = this.dropBptItem(
      this.tokens.map((t) => t.scale18)
    );
    if (swapAmount.scale18 > this.tokens[tOutIndex].scale18) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const amountOutWithRate = swapAmount.mulDownFixed(
      this.tokens[tOutIndex].rate
    );
    const invariant = _calculateInvariant(this.amp, balancesNoBpt);
    let amountIn;
    if (tokenIn.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
      const amountsOut = new Array(balancesNoBpt.length).fill(0n);
      amountsOut[this.skipBptIndex(tOutIndex)] = amountOutWithRate.scale18;
      const tokenInScale18 = _calcBptInGivenExactTokensOut(
        this.amp,
        [...balancesNoBpt],
        amountsOut,
        this.totalShares,
        invariant,
        this.swapFee
      );
      amountIn = TokenAmount.fromScale18Amount(
        tokenIn,
        tokenInScale18,
        true
      ).divDownFixed(this.tokens[tInIndex].rate);
    } else if (tokenOut.isUnderlyingEqual(this.tokens[this.bptIndex].token)) {
      const tokenInScale18 = _calcTokenInGivenExactBptOut(
        this.amp,
        [...balancesNoBpt],
        this.skipBptIndex(tInIndex),
        amountOutWithRate.scale18,
        this.totalShares,
        invariant,
        this.swapFee
      );
      amountIn = TokenAmount.fromScale18Amount(
        tokenIn,
        tokenInScale18,
        true
      ).divDownFixed(this.tokens[tInIndex].rate);
    } else {
      const tokenInScale18 = _calcInGivenOut2(
        this.amp,
        [...balancesNoBpt],
        this.skipBptIndex(tInIndex),
        this.skipBptIndex(tOutIndex),
        amountOutWithRate.scale18,
        invariant
      );
      const amountInWithoutFee = TokenAmount.fromScale18Amount(
        tokenIn,
        tokenInScale18,
        true
      );
      const amountInWithFee = this.addSwapFeeAmount(amountInWithoutFee);
      amountIn = amountInWithFee.divDownFixed(this.tokens[tInIndex].rate);
    }
    if (amountIn.amount < 0n)
      throw new Error("Swap output negative");
    if (mutateBalances) {
      this.tokens[tInIndex].increase(amountIn.amount);
      this.tokens[tOutIndex].decrease(swapAmount.amount);
      if (tInIndex === this.bptIndex) {
        this.totalShares = this.totalShares - amountIn.amount;
      } else if (tOutIndex === this.bptIndex) {
        this.totalShares = this.totalShares + swapAmount.amount;
      }
    }
    return amountIn;
  }
  subtractSwapFeeAmount(amount) {
    const feeAmount = amount.mulUpFixed(this.swapFee);
    return amount.sub(feeAmount);
  }
  addSwapFeeAmount(amount) {
    return amount.divUpFixed(MathSol.complementFixed(this.swapFee));
  }
  getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
    const tIn = this.tokenMap.get(tokenIn.address);
    const tOut = this.tokenMap.get(tokenOut.address);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    if (swapKind === 0 /* GivenIn */) {
      return tIn.amount * WAD / tIn.rate;
    } else {
      return tOut.amount * WAD / tOut.rate;
    }
  }
  skipBptIndex(index) {
    if (index === this.bptIndex)
      throw new Error("Cannot skip BPT index");
    return index < this.bptIndex ? index : index - 1;
  }
  dropBptItem(amounts) {
    const amountsWithoutBpt = new Array(amounts.length - 1).fill(0n);
    for (let i = 0; i < amountsWithoutBpt.length; i++) {
      amountsWithoutBpt[i] = amounts[i < this.bptIndex ? i : i + 1];
    }
    return amountsWithoutBpt;
  }
};

// src/entities/pools/metastable/metastableFactory.ts
var MetaStablePoolFactory = class {
  isPoolForFactory(pool) {
    return pool.poolType === "MetaStable";
  }
  create(chainId, pool) {
    return MetaStablePool.fromRawPool(chainId, pool);
  }
};

// src/entities/pools/metastable/metastablePool.ts
import { parseEther as parseEther3 } from "viem";
var MetaStablePool = class {
  constructor(id, amp, swapFee, tokens) {
    __publicField(this, "chainId");
    __publicField(this, "id");
    __publicField(this, "address");
    __publicField(this, "poolType", "MetaStable" /* MetaStable */);
    __publicField(this, "amp");
    __publicField(this, "swapFee");
    __publicField(this, "tokens");
    __publicField(this, "tokenMap");
    __publicField(this, "tokenIndexMap");
    this.chainId = tokens[0].token.chainId;
    this.id = id;
    this.address = getPoolAddress(id);
    this.amp = amp;
    this.swapFee = swapFee;
    this.tokens = tokens.sort((a, b) => a.index - b.index);
    this.tokenMap = new Map(
      this.tokens.map((token) => [token.token.address, token])
    );
    this.tokenIndexMap = new Map(
      this.tokens.map((token) => [token.token.address, token.index])
    );
  }
  static fromRawPool(chainId, pool) {
    const poolTokens = [];
    for (const t of pool.tokens) {
      if (!t.priceRate)
        throw new Error(
          "Meta Stable pool token does not have a price rate"
        );
      const token = new Token(
        chainId,
        t.address,
        t.decimals,
        t.symbol,
        t.name
      );
      const tokenAmount = TokenAmount.fromHumanAmount(token, t.balance);
      const tokenIndex = t.index ?? pool.tokensList.findIndex((t2) => t2 === token.address);
      poolTokens.push(
        new StablePoolToken(
          token,
          tokenAmount.amount,
          parseEther3(t.priceRate),
          tokenIndex
        )
      );
    }
    const amp = BigInt(pool.amp) * 1000n;
    return new MetaStablePool(
      pool.id,
      amp,
      parseEther3(pool.swapFee),
      poolTokens
    );
  }
  getNormalizedLiquidity(tokenIn, tokenOut) {
    const tIn = this.tokenMap.get(tokenIn.address);
    const tOut = this.tokenMap.get(tokenOut.address);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    return tOut.amount * this.amp;
  }
  swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const tInIndex = this.tokenIndexMap.get(tokenIn.address);
    const tOutIndex = this.tokenIndexMap.get(tokenOut.address);
    if (typeof tInIndex !== "number" || typeof tOutIndex !== "number") {
      throw new Error("Pool does not contain the tokens provided");
    }
    if (swapAmount.amount > this.tokens[tInIndex].amount) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const amountInWithFee = this.subtractSwapFeeAmount(swapAmount);
    const amountInWithRate = amountInWithFee.mulDownFixed(
      this.tokens[tInIndex].rate
    );
    const balances = this.tokens.map((t) => t.scale18);
    const invariant = _calculateInvariant(this.amp, [...balances], true);
    const tokenOutScale18 = _calcOutGivenIn2(
      this.amp,
      [...balances],
      tInIndex,
      tOutIndex,
      amountInWithRate.scale18,
      invariant
    );
    const amountOut = TokenAmount.fromScale18Amount(
      tokenOut,
      tokenOutScale18
    );
    const amountOutWithRate = amountOut.divDownFixed(
      this.tokens[tOutIndex].rate
    );
    if (amountOutWithRate.amount < 0n)
      throw new Error("Swap output negative");
    if (mutateBalances) {
      this.tokens[tInIndex].increase(swapAmount.amount);
      this.tokens[tOutIndex].decrease(amountOutWithRate.amount);
    }
    return amountOutWithRate;
  }
  swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const tInIndex = this.tokenIndexMap.get(tokenIn.address);
    const tOutIndex = this.tokenIndexMap.get(tokenOut.address);
    if (typeof tInIndex !== "number" || typeof tOutIndex !== "number") {
      throw new Error("Pool does not contain the tokens provided");
    }
    if (swapAmount.amount > this.tokens[tOutIndex].amount) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    const amountOutWithRate = swapAmount.mulDownFixed(
      this.tokens[tOutIndex].rate
    );
    const balances = this.tokens.map((t) => t.scale18);
    const invariant = _calculateInvariant(this.amp, balances, true);
    const tokenInScale18 = _calcInGivenOut2(
      this.amp,
      [...balances],
      tInIndex,
      tOutIndex,
      amountOutWithRate.scale18,
      invariant
    );
    const amountIn = TokenAmount.fromScale18Amount(
      tokenIn,
      tokenInScale18,
      true
    );
    const amountInWithFee = this.addSwapFeeAmount(amountIn);
    const amountInWithRate = amountInWithFee.divDownFixed(
      this.tokens[tInIndex].rate
    );
    if (amountInWithRate.amount < 0n)
      throw new Error("Swap output negative");
    if (mutateBalances) {
      this.tokens[tInIndex].increase(amountInWithRate.amount);
      this.tokens[tOutIndex].decrease(swapAmount.amount);
    }
    return amountInWithRate;
  }
  subtractSwapFeeAmount(amount) {
    const feeAmount = amount.mulUpFixed(this.swapFee);
    return amount.sub(feeAmount);
  }
  addSwapFeeAmount(amount) {
    return amount.divUpFixed(MathSol.complementFixed(this.swapFee));
  }
  getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
    const tIn = this.tokenMap.get(tokenIn.address);
    const tOut = this.tokenMap.get(tokenOut.address);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    if (swapKind === 0 /* GivenIn */) {
      return tIn.amount * WAD / tIn.rate;
    } else {
      return tOut.amount * WAD / tOut.rate;
    }
  }
};

// src/entities/pools/linear/linearFactory.ts
var LinearPoolFactory = class {
  isPoolForFactory(pool) {
    return pool.poolType.includes("Linear");
  }
  create(chainId, pool) {
    return LinearPool.fromRawPool(chainId, pool);
  }
};

// src/entities/pools/linear/linearPool.ts
import { parseEther as parseEther4 } from "viem";

// src/entities/pools/linear/linearMath.ts
function _calcWrappedOutPerMainIn(mainIn, mainBalance, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = _toNominal(mainBalance + mainIn, params);
  return afterNominalMain - previousNominalMain;
}
function _calcBptOutPerMainIn(mainIn, mainBalance, wrappedBalance, bptSupply, params) {
  if (bptSupply === 0n) {
    return _toNominal(mainIn, params);
  }
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = _toNominal(mainBalance + mainIn, params);
  const deltaNominalMain = afterNominalMain - previousNominalMain;
  const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
  return bptSupply * deltaNominalMain / invariant;
}
function _calcMainOutPerWrappedIn(wrappedIn, mainBalance, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = previousNominalMain - wrappedIn;
  const newMainBalance = _fromNominal(afterNominalMain, params);
  return mainBalance - newMainBalance;
}
function _calcBptOutPerWrappedIn(wrappedIn, mainBalance, wrappedBalance, bptSupply, params) {
  if (bptSupply === 0n) {
    return wrappedIn;
  }
  const nominalMain = _toNominal(mainBalance, params);
  const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
  const newWrappedBalance = wrappedBalance + wrappedIn;
  const newInvariant = _calcInvariant(nominalMain, newWrappedBalance);
  const newBptBalance = bptSupply * newInvariant / previousInvariant;
  return newBptBalance - bptSupply;
}
function _calcMainOutPerBptIn(bptIn, mainBalance, wrappedBalance, bptSupply, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
  const deltaNominalMain = invariant * bptIn / bptSupply;
  const afterNominalMain = previousNominalMain - deltaNominalMain;
  const newMainBalance = _fromNominal(afterNominalMain, params);
  return mainBalance - newMainBalance;
}
function _calcWrappedOutPerBptIn(bptIn, mainBalance, wrappedBalance, bptSupply, params) {
  const nominalMain = _toNominal(mainBalance, params);
  const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
  const newBptBalance = bptSupply - bptIn;
  const newWrappedBalance = newBptBalance * previousInvariant / bptSupply - nominalMain;
  return wrappedBalance - newWrappedBalance;
}
function _calcMainInPerWrappedOut(wrappedOut, mainBalance, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = previousNominalMain + wrappedOut;
  const newMainBalance = _fromNominal(afterNominalMain, params);
  return newMainBalance - mainBalance;
}
function _calcMainInPerBptOut(bptOut, mainBalance, wrappedBalance, bptSupply, params) {
  if (bptSupply === 0n) {
    return _fromNominal(bptOut, params);
  }
  const previousNominalMain = _toNominal(mainBalance, params);
  const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
  const deltaNominalMain = invariant * bptOut / bptSupply;
  const afterNominalMain = previousNominalMain + deltaNominalMain;
  const newMainBalance = _fromNominal(afterNominalMain, params);
  return newMainBalance - mainBalance;
}
function _calcWrappedInPerMainOut(mainOut, mainBalance, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = _toNominal(mainBalance - mainOut, params);
  return previousNominalMain - afterNominalMain;
}
function _calcWrappedInPerBptOut(bptOut, mainBalance, wrappedBalance, bptSupply, params) {
  if (bptSupply === 0n) {
    return bptOut;
  }
  const nominalMain = _toNominal(mainBalance, params);
  const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
  const newBptBalance = bptSupply + bptOut;
  const newWrappedBalance = newBptBalance * previousInvariant / bptSupply - nominalMain;
  return newWrappedBalance - wrappedBalance;
}
function _calcBptInPerWrappedOut(wrappedOut, mainBalance, wrappedBalance, bptSupply, params) {
  const nominalMain = _toNominal(mainBalance, params);
  const previousInvariant = _calcInvariant(nominalMain, wrappedBalance);
  const newWrappedBalance = wrappedBalance - wrappedOut;
  const newInvariant = _calcInvariant(nominalMain, newWrappedBalance);
  const newBptBalance = bptSupply * newInvariant / previousInvariant;
  return bptSupply - newBptBalance;
}
function _calcBptInPerMainOut(mainOut, mainBalance, wrappedBalance, bptSupply, params) {
  const previousNominalMain = _toNominal(mainBalance, params);
  const afterNominalMain = _toNominal(mainBalance - mainOut, params);
  const deltaNominalMain = previousNominalMain - afterNominalMain;
  const invariant = _calcInvariant(previousNominalMain, wrappedBalance);
  return bptSupply * deltaNominalMain / invariant;
}
function _calcInvariant(nominalMainBalance, wrappedBalance) {
  return nominalMainBalance + wrappedBalance;
}
function _toNominal(real, params) {
  if (real < params.lowerTarget) {
    const fees = MathSol.mulDownFixed(
      params.lowerTarget - real,
      params.fee
    );
    return real - fees;
  } else if (real <= params.upperTarget) {
    return real;
  } else {
    const fees = MathSol.mulDownFixed(
      real - params.upperTarget,
      params.fee
    );
    return real - fees;
  }
}
function _fromNominal(nominal, params) {
  if (nominal < params.lowerTarget) {
    return MathSol.divDownFixed(
      nominal + MathSol.mulDownFixed(params.fee, params.lowerTarget),
      WAD + params.fee
    );
  } else if (nominal <= params.upperTarget) {
    return nominal;
  } else {
    return MathSol.divDownFixed(
      nominal - MathSol.mulDownFixed(params.fee, params.upperTarget),
      WAD - params.fee
    );
  }
}

// src/entities/pools/linear/linearPool.ts
var ONE = parseEther4("1");
var MAX_RATIO = parseEther4("10");
var MAX_TOKEN_BALANCE = MAX_UINT112 - 1n;
var BPT = class extends TokenAmount {
  constructor(token, amount, index) {
    super(token, amount);
    __publicField(this, "rate");
    __publicField(this, "index");
    __publicField(this, "virtualBalance");
    this.rate = WAD;
    this.virtualBalance = MAX_TOKEN_BALANCE - this.amount;
    this.index = index;
  }
  increase(amount) {
    this.amount = this.amount + amount;
    this.virtualBalance = this.virtualBalance + amount;
    this.scale18 = this.amount * this.scalar;
    return this;
  }
  decrease(amount) {
    this.amount = this.amount - amount;
    this.virtualBalance = this.virtualBalance - amount;
    this.scale18 = this.amount * this.scalar;
    return this;
  }
};
var LinearPool = class {
  constructor(id, poolTypeVersion, params, mainToken, wrappedToken, bptToken) {
    __publicField(this, "chainId");
    __publicField(this, "id");
    __publicField(this, "address");
    __publicField(this, "poolType", "AaveLinear" /* AaveLinear */);
    __publicField(this, "poolTypeVersion");
    __publicField(this, "swapFee");
    __publicField(this, "mainToken");
    __publicField(this, "wrappedToken");
    __publicField(this, "bptToken");
    __publicField(this, "params");
    __publicField(this, "tokens");
    __publicField(this, "tokenMap");
    this.chainId = mainToken.token.chainId;
    this.id = id;
    this.poolTypeVersion = poolTypeVersion;
    this.swapFee = params.fee;
    this.mainToken = mainToken;
    this.wrappedToken = wrappedToken;
    this.bptToken = bptToken;
    this.address = getPoolAddress(id);
    this.params = params;
    this.tokens = [this.mainToken, this.wrappedToken, this.bptToken];
    this.tokenMap = new Map(
      this.tokens.map((token) => [token.token.address, token])
    );
  }
  static fromRawPool(chainId, pool) {
    const orderedTokens = pool.tokens.sort((a, b) => a.index - b.index);
    const swapFee = parseEther4(pool.swapFee);
    const mT = orderedTokens[pool.mainIndex];
    const mTRate = parseEther4(mT.priceRate || "1.0");
    const mToken = new Token(
      chainId,
      mT.address,
      mT.decimals,
      mT.symbol,
      mT.name
    );
    const lowerTarget = TokenAmount.fromHumanAmount(
      mToken,
      pool.lowerTarget
    );
    const upperTarget = TokenAmount.fromHumanAmount(
      mToken,
      pool.upperTarget
    );
    const mTokenAmount = TokenAmount.fromHumanAmount(mToken, mT.balance);
    const mainToken = new StablePoolToken(
      mToken,
      mTokenAmount.amount,
      mTRate,
      mT.index
    );
    const wT = orderedTokens[pool.wrappedIndex];
    const wTRate = parseEther4(wT.priceRate || "1.0");
    const wToken = new Token(
      chainId,
      wT.address,
      wT.decimals,
      wT.symbol,
      wT.name
    );
    const wTokenAmount = TokenAmount.fromHumanAmount(wToken, wT.balance);
    const wrappedToken = new StablePoolToken(
      wToken,
      wTokenAmount.amount,
      wTRate,
      wT.index
    );
    const bptIndex = orderedTokens.findIndex(
      (t) => t.address === pool.address
    );
    const bT = orderedTokens[bptIndex];
    const bToken = new Token(
      chainId,
      bT.address,
      bT.decimals,
      bT.symbol,
      bT.name
    );
    const bTokenAmount = TokenAmount.fromHumanAmount(bToken, bT.balance);
    const bptToken = new BPT(bToken, bTokenAmount.amount, bT.index);
    const params = {
      fee: swapFee,
      rate: wTRate,
      lowerTarget: lowerTarget.scale18,
      upperTarget: upperTarget.scale18
    };
    return new LinearPool(
      pool.id,
      pool.poolTypeVersion,
      params,
      mainToken,
      wrappedToken,
      bptToken
    );
  }
  getNormalizedLiquidity(tokenIn, tokenOut) {
    const tIn = this.tokenMap.get(tokenIn.wrapped);
    const tOut = this.tokenMap.get(tokenOut.wrapped);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    return tOut.amount;
  }
  swapGivenIn(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    let output;
    if (tokenIn.isEqual(this.mainToken.token)) {
      if (tokenOut.isEqual(this.wrappedToken.token)) {
        output = this._exactMainTokenInForWrappedOut(swapAmount);
        output = output.divDownFixed(this.wrappedToken.rate);
      } else {
        output = this._exactMainTokenInForBptOut(swapAmount);
      }
    } else if (tokenIn.isEqual(this.wrappedToken.token)) {
      swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
      if (tokenOut.isEqual(this.mainToken.token)) {
        output = this._exactWrappedTokenInForMainOut(swapAmount);
      } else {
        output = this._exactWrappedTokenInForBptOut(swapAmount);
      }
    } else if (tokenIn.isEqual(this.bptToken.token)) {
      if (tokenOut.isEqual(this.mainToken.token)) {
        output = this._exactBptInForMainOut(swapAmount);
      } else {
        output = this._exactBptInForWrappedOut(swapAmount);
        output = output.divDownFixed(this.wrappedToken.rate);
      }
    } else {
      throw new Error("Pool does not contain the tokens provided");
    }
    if (output.amount > (tOut?.amount || 0n)) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    if (output.amount < 0n)
      throw new Error("Swap amount is negative");
    if (mutateBalances) {
      tIn.increase(swapAmount.amount);
      tOut.decrease(output.amount);
    }
    return output;
  }
  swapGivenOut(tokenIn, tokenOut, swapAmount, mutateBalances) {
    const { tIn, tOut } = this.getRequiredTokenPair(tokenIn, tokenOut);
    if (swapAmount.amount > (tOut?.amount || 0n)) {
      throw new Error("Swap amount exceeds the pool limit");
    }
    let input;
    if (tokenIn.isEqual(this.mainToken.token)) {
      if (tokenOut.isEqual(this.wrappedToken.token)) {
        swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
        input = this._mainTokenInForExactWrappedOut(swapAmount);
      } else {
        input = this._mainTokenInForExactBptOut(swapAmount);
      }
    } else if (tokenIn.isEqual(this.wrappedToken.token)) {
      if (tokenOut.isEqual(this.mainToken.token)) {
        input = this._wrappedTokenInForExactMainOut(swapAmount);
      } else {
        input = this._wrappedTokenInForExactBptOut(swapAmount);
      }
      input = input.mulDownFixed(this.wrappedToken.rate);
    } else if (tokenIn.isEqual(this.bptToken.token)) {
      if (tokenOut.isEqual(this.mainToken.token)) {
        input = this._bptInForExactMainOut(swapAmount);
      } else {
        swapAmount = swapAmount.mulDownFixed(this.wrappedToken.rate);
        input = this._bptInForExactWrappedOut(swapAmount);
      }
    } else {
      throw new Error("Pool does not contain the tokens provided");
    }
    if (input.amount < 0n)
      throw new Error("Swap amount is negative");
    if (mutateBalances) {
      tIn.increase(input.amount);
      tOut.decrease(swapAmount.amount);
    }
    return input;
  }
  getLimitAmountSwap(tokenIn, tokenOut, swapKind) {
    const tIn = this.tokenMap.get(tokenIn.wrapped);
    const tOut = this.tokenMap.get(tokenOut.wrapped);
    if (!tIn || !tOut)
      throw new Error("Pool does not contain the tokens provided");
    if (swapKind === 0 /* GivenIn */) {
      if (tokenOut.isEqual(this.bptToken.token)) {
        return MAX_TOKEN_BALANCE;
      } else {
        const amount = TokenAmount.fromRawAmount(tokenOut, tOut.amount);
        return this.swapGivenOut(tokenIn, tokenOut, amount).amount;
      }
    } else {
      if (tokenOut.isEqual(this.bptToken.token)) {
        return tOut.amount * MAX_RATIO / ONE;
      } else {
        return tOut.amount;
      }
    }
  }
  _exactMainTokenInForWrappedOut(swapAmount) {
    const tokenOutScale18 = _calcWrappedOutPerMainIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.wrappedToken.token,
      tokenOutScale18
    );
  }
  _exactMainTokenInForBptOut(swapAmount) {
    const tokenOutScale18 = _calcBptOutPerMainIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.bptToken.token,
      tokenOutScale18
    );
  }
  _exactWrappedTokenInForMainOut(swapAmount) {
    const tokenOutScale18 = _calcMainOutPerWrappedIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.mainToken.token,
      tokenOutScale18
    );
  }
  _exactWrappedTokenInForBptOut(swapAmount) {
    const tokenOutScale18 = _calcBptOutPerWrappedIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.bptToken.token,
      tokenOutScale18
    );
  }
  _exactBptInForMainOut(swapAmount) {
    const tokenOutScale18 = _calcMainOutPerBptIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.mainToken.token,
      tokenOutScale18
    );
  }
  _exactBptInForWrappedOut(swapAmount) {
    const tokenOutScale18 = _calcWrappedOutPerBptIn(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.wrappedToken.token,
      tokenOutScale18
    );
  }
  _mainTokenInForExactWrappedOut(swapAmount) {
    const tokenOutScale18 = _calcMainInPerWrappedOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.mainToken.token,
      tokenOutScale18,
      true
    );
  }
  _mainTokenInForExactBptOut(swapAmount) {
    const tokenOutScale18 = _calcMainInPerBptOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.mainToken.token,
      tokenOutScale18,
      true
    );
  }
  _wrappedTokenInForExactMainOut(swapAmount) {
    const tokenOutScale18 = _calcWrappedInPerMainOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.wrappedToken.token,
      tokenOutScale18,
      true
    );
  }
  _wrappedTokenInForExactBptOut(swapAmount) {
    const tokenOutScale18 = _calcWrappedInPerBptOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.wrappedToken.token,
      tokenOutScale18,
      true
    );
  }
  _bptInForExactMainOut(swapAmount) {
    const tokenOutScale18 = _calcBptInPerMainOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.bptToken.token,
      tokenOutScale18,
      true
    );
  }
  _bptInForExactWrappedOut(swapAmount) {
    const tokenOutScale18 = _calcBptInPerWrappedOut(
      swapAmount.scale18,
      this.mainToken.scale18,
      this.wrappedToken.scale18,
      this.bptToken.virtualBalance,
      this.params
    );
    return TokenAmount.fromScale18Amount(
      this.bptToken.token,
      tokenOutScale18,
      true
    );
  }
  getRequiredTokenPair(tokenIn, tokenOut) {
    const tIn = this.tokenMap.get(tokenIn.wrapped);
    const tOut = this.tokenMap.get(tokenOut.wrapped);
    if (!tIn || !tOut) {
      throw new Error("Pool does not contain the tokens provided");
    }
    return { tIn, tOut };
  }
};

// src/entities/pools/parser.ts
var PoolParser = class {
  constructor(chainId, customPoolFactories) {
    __publicField(this, "poolFactories");
    __publicField(this, "chainId");
    this.chainId = chainId;
    this.poolFactories = [
      // custom pool factories take precedence over base factories
      ...customPoolFactories,
      new WeightedPoolFactory(),
      new StablePoolFactory(),
      new MetaStablePoolFactory(),
      new LinearPoolFactory()
    ];
  }
  parseRawPools(rawPools) {
    const pools = [];
    for (const rawPool of rawPools) {
      for (const factory of this.poolFactories) {
        if (factory.isPoolForFactory(rawPool)) {
          pools.push(factory.create(this.chainId, rawPool));
          break;
        }
      }
    }
    return pools;
  }
};

// src/data/poolDataService.ts
import { createPublicClient as createPublicClient3, http as http3 } from "viem";
var PoolDataService = class {
  constructor(providers, enrichers, rpcUrl) {
    this.providers = providers;
    this.enrichers = enrichers;
    this.rpcUrl = rpcUrl;
  }
  async fetchEnrichedPools(blockNumber) {
    const providerOptions = {
      block: blockNumber,
      timestamp: await this.getTimestampForBlockNumber(blockNumber)
    };
    const responses = await Promise.all(
      this.providers.map(
        (provider) => provider.getPools(providerOptions)
      )
    );
    const providerData = {
      pools: responses.flatMap((response) => response.pools),
      //we take the smallest block number from the set
      syncedToBlockNumber: responses.map((response) => response.syncedToBlockNumber || 0n).sort()[0],
      poolsWithActiveWeightUpdates: responses.flatMap(
        (response) => response.poolsWithActiveWeightUpdates || []
      ),
      poolsWithActiveAmpUpdates: responses.flatMap(
        (response) => response.poolsWithActiveAmpUpdates || []
      )
    };
    return {
      rawPools: await this.enrichPools(providerData, providerOptions),
      providerData
    };
  }
  async enrichPools(data, providerOptions) {
    let pools = data.pools;
    const additionalPoolData = await Promise.all(
      this.enrichers.map(
        (provider) => provider.fetchAdditionalPoolData(data, providerOptions)
      )
    );
    for (let i = 0; i < this.enrichers.length; i++) {
      pools = this.enrichers[i].enrichPoolsWithData(
        pools,
        additionalPoolData[i]
      );
    }
    return pools;
  }
  async getTimestampForBlockNumber(blockNumber) {
    if (blockNumber) {
      const client = createPublicClient3({
        transport: http3(this.rpcUrl)
      });
      return (await client.getBlock({ blockNumber })).timestamp;
    } else {
      return BigInt(Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3));
    }
  }
};

// src/sor.ts
var SmartOrderRouter = class {
  constructor({
    chainId,
    rpcUrl,
    poolDataProviders,
    poolDataEnrichers,
    customPoolFactories = []
  }) {
    __publicField(this, "chainId");
    __publicField(this, "router");
    __publicField(this, "poolParser");
    __publicField(this, "poolDataService");
    __publicField(this, "pools", []);
    __publicField(this, "blockNumber", null);
    __publicField(this, "poolsProviderData", null);
    this.chainId = chainId;
    this.router = new Router();
    this.poolParser = new PoolParser(chainId, customPoolFactories);
    poolDataProviders = poolDataProviders || new SubgraphPoolProvider(chainId, SUBGRAPH_URLS[chainId]);
    poolDataEnrichers = poolDataEnrichers || new OnChainPoolDataEnricher(rpcUrl, BALANCER_SOR_QUERIES_ADDRESS);
    this.poolDataService = new PoolDataService(
      Array.isArray(poolDataProviders) ? poolDataProviders : [poolDataProviders],
      Array.isArray(poolDataEnrichers) ? poolDataEnrichers : [poolDataEnrichers],
      rpcUrl
    );
  }
  async fetchAndCachePools(blockNumber) {
    const { rawPools, providerData } = await this.poolDataService.fetchEnrichedPools(blockNumber);
    this.pools = this.poolParser.parseRawPools(rawPools);
    this.blockNumber = typeof blockNumber === "bigint" ? blockNumber : null;
    this.poolsProviderData = providerData;
    return this.pools;
  }
  async fetchAndCacheLatestPoolEnrichmentData(blockNumber) {
    if (!this.poolsProviderData) {
      throw new Error(
        "fetchAndCacheLatestPoolEnrichmentData can only be called after a successful call to fetchAndCachePools"
      );
    }
    const providerOptions = {
      block: blockNumber,
      timestamp: await this.poolDataService.getTimestampForBlockNumber(
        blockNumber
      )
    };
    const enriched = await this.poolDataService.enrichPools(
      this.poolsProviderData,
      providerOptions
    );
    this.pools = this.poolParser.parseRawPools(enriched);
  }
  get isInitialized() {
    return this.pools.length > 0;
  }
  async getSwaps(tokenIn, tokenOut, swapKind, swapAmount, swapOptions) {
    swapAmount = checkInputs(tokenIn, tokenOut, swapKind, swapAmount);
    const candidatePaths = await this.getCandidatePaths(
      tokenIn,
      tokenOut,
      swapOptions
    );
    const bestPaths = this.router.getBestPaths(
      candidatePaths,
      swapKind,
      swapAmount
    );
    if (!bestPaths)
      return null;
    return new Swap({ paths: bestPaths, swapKind });
  }
  async getCandidatePaths(tokenIn, tokenOut, options) {
    if (!this.isInitialized || options?.block && options.block !== this.blockNumber) {
      await this.fetchAndCachePools(options?.block);
    }
    return this.router.getCandidatePaths(
      tokenIn,
      tokenOut,
      this.pools,
      options?.graphTraversalConfig
    );
  }
};

// src/static.ts
function sorParseRawPools(chainId, pools, customPoolFactories = []) {
  const poolParser = new PoolParser(chainId, customPoolFactories);
  return poolParser.parseRawPools(pools);
}
async function sorGetSwapsWithPools(tokenIn, tokenOut, swapKind, swapAmount, pools, swapOptions) {
  swapAmount = checkInputs(tokenIn, tokenOut, swapKind, swapAmount);
  const router = new Router();
  const candidatePaths = router.getCandidatePaths(
    tokenIn,
    tokenOut,
    pools,
    swapOptions?.graphTraversalConfig
  );
  const bestPaths = router.getBestPaths(candidatePaths, swapKind, swapAmount);
  if (!bestPaths)
    return null;
  return new Swap({ paths: bestPaths, swapKind });
}
export {
  Address,
  BALANCER_QUERIES,
  BALANCER_SOR_QUERIES_ADDRESS,
  ChainId,
  DECIMAL_SCALES,
  DEFAULT_FUND_MANAGMENT,
  DEFAULT_USERDATA,
  ETH,
  FOUR_WAD,
  Hex,
  MAX_UINT112,
  MathSol,
  NATIVE_ADDRESS,
  NATIVE_ASSETS,
  OnChainPoolDataEnricher,
  PREMINTED_STABLE_BPT,
  Path,
  PathWithAmount,
  PoolType,
  SECONDS_PER_YEAR,
  STELLATE_URLS,
  SUBGRAPH_URLS,
  SmartOrderRouter,
  SubgraphPoolProvider,
  Swap,
  SwapKind,
  TWO_WAD,
  Token,
  TokenAmount,
  WAD,
  ZERO_ADDRESS,
  abs,
  checkInputs,
  getPoolAddress,
  poolHasActualSupply,
  poolHasPercentFee,
  poolHasVirtualSupply,
  poolIsLinearPool,
  sorGetSwapsWithPools,
  sorParseRawPools
};
//# sourceMappingURL=index.mjs.map