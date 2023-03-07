"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USERDATA = exports.DEFAULT_FUND_MANAGMENT = exports.ETH = exports.NATIVE_ASSETS = exports.STELLATE_URLS = exports.SUBGRAPH_URLS = exports.ChainId = exports.SECONDS_PER_YEAR = exports.PREMINTED_STABLE_BPT = exports.MAX_UINT112 = exports.ZERO_ADDRESS = void 0;
const token_1 = require("../entities/token");
exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.MAX_UINT112 = 5192296858534827628530496329220095n;
exports.PREMINTED_STABLE_BPT = 2596148429267413814265248164610048n; // 2**111
exports.SECONDS_PER_YEAR = 31536000n;
var ChainId;
(function (ChainId) {
    ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
    ChainId[ChainId["GOERLI"] = 5] = "GOERLI";
    ChainId[ChainId["GNOSIS_CHAIN"] = 100] = "GNOSIS_CHAIN";
    ChainId[ChainId["POLYGON"] = 137] = "POLYGON";
    ChainId[ChainId["ARBITRUM_ONE"] = 42161] = "ARBITRUM_ONE";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
exports.SUBGRAPH_URLS = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2',
    [ChainId.GNOSIS_CHAIN]: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gnosis-chain-v2',
    [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    [ChainId.ARBITRUM_ONE]: `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2`,
};
exports.STELLATE_URLS = {
    [ChainId.MAINNET]: 'https://balancer-v2.stellate.balancer.fi',
    [ChainId.GOERLI]: 'https://balancer-goerli-v2.stellate.balancer.fi',
    [ChainId.GNOSIS_CHAIN]: 'https://balancer-gnosis-chain-v2.stellate.balancer.fi',
    [ChainId.POLYGON]: 'https://balancer-polygon-v2.stellate.balancer.fi',
    [ChainId.ARBITRUM_ONE]: 'https://balancer-arbitrum-v2.stellate.balancer.fi',
};
exports.NATIVE_ASSETS = {
    [ChainId.MAINNET]: new token_1.Token(ChainId.MAINNET, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'ETH', 'Ether', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
    [ChainId.GOERLI]: new token_1.Token(ChainId.GOERLI, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'ETH', 'Ether', '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'),
    [ChainId.GNOSIS_CHAIN]: new token_1.Token(ChainId.GNOSIS_CHAIN, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'xDAI', 'xDAI', '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'),
    [ChainId.POLYGON]: new token_1.Token(ChainId.POLYGON, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'MATIC', 'Matic', '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'),
    [ChainId.ARBITRUM_ONE]: new token_1.Token(ChainId.ARBITRUM_ONE, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'ETH', 'Ether', '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'),
};
exports.ETH = exports.NATIVE_ASSETS[ChainId.MAINNET];
exports.DEFAULT_FUND_MANAGMENT = {
    sender: exports.ZERO_ADDRESS,
    recipient: exports.ZERO_ADDRESS,
    fromInternalBalance: false,
    toInternalBalance: false,
};
exports.DEFAULT_USERDATA = '0x';
//# sourceMappingURL=constants.js.map