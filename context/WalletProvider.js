import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useProvider, useAccount } from 'wagmi';
import { getStakingFactory, getTokenFactory } from '@utils/web3';
import { DEFAULT_TOKEN_NAME } from '@constants/common';

const WalletContext = createContext();

export default function WalletProvider({ children }) {
  const [userCustomTokenBalance, setUserCustomTokenBalance] = useState();
  const [userStakedAmount, setUserStakedAmount] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const getUserCustomTokenBalance = async ({ provider, address }) => {
    const tokenContract = getTokenFactory({ provider });
    const userTokenAmount = await tokenContract.balanceOf(address);
    setUserCustomTokenBalance(userTokenAmount);
  };

  const getUserStakedAmount = async ({ provider, address }) => {
    const stakingContract = getStakingFactory({ provider });
    const userStakedAmount = await stakingContract.balanceOf(address);
    setUserStakedAmount(userStakedAmount);
  };

  const getTokenSymbol = async ({ provider }) => {
    const tokenContract = getTokenFactory({ provider });
    const tokenSymbol = await tokenContract.symbol();
    setTokenSymbol(tokenSymbol || DEFAULT_TOKEN_NAME);
  };

  useEffect(() => {
    isConnected && getUserCustomTokenBalance({ provider, address });
    isConnected && getUserStakedAmount({ provider, address });
    getTokenSymbol({ provider });
  }, [address]);

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
