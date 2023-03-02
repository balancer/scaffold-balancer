export interface PoolToken {
  address: string;
  symbol: string;
  decimals: number;
  balance: string;
}

export interface PoolTokenWithUserBalance extends PoolToken {
  userBalance: string;
}

export type PoolUserDataType = PoolUserDataUint256 | PoolUserDataUint256Array;

export interface PoolUserDataUint256 {
  type: 'uint256';
  value: string;
}

export interface PoolUserDataUint256Array {
  type: 'uint256[]';
  value: string[];
}
