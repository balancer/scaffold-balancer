import { PathWithAmount } from './path';
import { TokenAmount } from './tokenAmount';
import { SingleSwap, SwapKind, BatchSwapStep } from '../types';
import { BaseProvider } from '@ethersproject/providers';
export declare class Swap {
    constructor({ paths, swapKind }: {
        paths: PathWithAmount[];
        swapKind: SwapKind;
    });
    readonly isBatchSwap: boolean;
    readonly paths: PathWithAmount[];
    readonly assets: string[];
    readonly swapKind: SwapKind;
    swaps: BatchSwapStep[] | SingleSwap;
    get inputAmount(): TokenAmount;
    get outputAmount(): TokenAmount;
    query(provider: BaseProvider, block?: number): Promise<TokenAmount>;
    private convertNativeAddressToZero;
    callData(): string;
}
