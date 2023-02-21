import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useProvider, useAccount } from 'wagmi';
import { getStakingFactory, getTokenFactory } from '@utils/web3';
import { DEFAULT_TOKEN_NAME } from '@constants/common';
import Context from '@interfaces/wallet';
import ChildrenType from '@interfaces/children';
import { Contract, signerOrProvider } from '@interfaces/provider';




const WalletContext = createContext<Context | null>(null);

export default function WalletProvider({ children }: ChildrenType) {
  const [userCustomTokenBalance, setUserCustomTokenBalance] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const wallet = useAccount();
  const provider = useProvider();

  const getUserCustomTokenBalance = async ({ signerOrProvider, address }: Contract) => {
    const tokenContract = getTokenFactory(signerOrProvider);
    const userTokenAmount = await tokenContract.balanceOf(address);
    setUserCustomTokenBalance(userTokenAmount);
  };

  const getUserStakedAmount = async ({ signerOrProvider, address }: Contract) => {
    const stakingContract = getStakingFactory(signerOrProvider);
    const userStakedAmount = await stakingContract.balanceOf(address);
    setUserStakedAmount(userStakedAmount);
  };

  const getTokenSymbol = async (signerOrProvider: signerOrProvider) => {
    const tokenContract = getTokenFactory(signerOrProvider);
    const tokenSymbol = await tokenContract.symbol();
    setTokenSymbol(tokenSymbol || DEFAULT_TOKEN_NAME);
  };

  useEffect(() => {
    wallet.isConnected && getUserCustomTokenBalance({ signerOrProvider: provider, address: wallet.address || '' });
    wallet.isConnected && getUserStakedAmount({ signerOrProvider: provider, address: wallet.address || '' });
    getTokenSymbol(provider);
  }, [wallet.address]);

  return (
    <WalletContext.Provider
      value={{
        userCustomTokenBalance,
        userStakedAmount,
        tokenSymbol,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  return useContext(WalletContext);
};
