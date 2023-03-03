export interface BatchSwapPathData {
  tokenIn: string | null;
  hops: {
    poolId: string | null;
    tokenOut: string | null;
  }[];
  amount: string;
}

export type BatchSwapType = 'GIVEN_IN' | 'GIVEN_OUT';
