import { Token, TokenAmount } from '../entities';
import { SwapKind } from '../types';
export declare function checkInputs(tokenIn: Token, tokenOut: Token, swapKind: SwapKind, swapAmount: TokenAmount): void;
