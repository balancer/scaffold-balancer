export interface BatchSwapPathData {
  tokenIn: string | null;
  hops: {
    poolId: string | null;
    tokenOut: string | null;
  }[];
  amount: string;
}

export type SwapType = 'GIVEN_IN' | 'GIVEN_OUT';
