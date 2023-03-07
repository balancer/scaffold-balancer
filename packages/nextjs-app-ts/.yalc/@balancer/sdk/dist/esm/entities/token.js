export class Token {
    constructor(chainId, address, decimals, symbol, name, wrapped) {
        this.chainId = chainId;
        this.address = address.toLowerCase();
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
        wrapped ? (this.wrapped = wrapped.toLowerCase()) : (this.wrapped = address.toLowerCase());
    }
    isEqual(token) {
        return this.chainId === token.chainId && this.address === token.address;
    }
    isUnderlyingEqual(token) {
        return this.chainId === token.chainId && this.wrapped === token.wrapped;
    }
}
//# sourceMappingURL=token.js.map