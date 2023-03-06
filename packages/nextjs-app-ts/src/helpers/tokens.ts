import { RawPoolToken } from '@balancer/sdk';

export function getToken(tokenAddress: string, tokens: RawPoolToken[]): RawPoolToken | null {
  return tokens.find((token) => token.address === tokenAddress) || null;
}
