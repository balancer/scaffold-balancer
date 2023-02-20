import { useGasPrice } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';

export function useTxGasPrice() {
  const { chainId } = useEthersAppContext();
  const [gasPrice] = useGasPrice(chainId, 'fast');

  return (gasPrice || 1) * 1_000_000_000;
}
