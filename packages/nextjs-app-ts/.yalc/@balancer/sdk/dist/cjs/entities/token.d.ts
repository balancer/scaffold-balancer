export declare class Token {
    readonly chainId: number;
    readonly address: string;
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    readonly wrapped: string;
    constructor(chainId: number, address: string, decimals: number, symbol?: string, name?: string, wrapped?: string);
    isEqual(token: Token): boolean;
    isUnderlyingEqual(token: Token): boolean;
}
