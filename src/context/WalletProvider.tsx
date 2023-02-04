import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useProvider, useAccount } from 'wagmi';
import { getStakingFactory, getTokenFactory } from '@utils/web3';
import { DEFAULT_TOKEN_NAME } from '@constants/common';
import Context from '@interfaces/wallet';
import Props from '@interfaces/children';


const WalletContext = createContext<Context | null>(null);

export default function WalletProvider({ children }: Props) {
  const [userCustomTokenBalance, setUserCustomTokenBalance] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const getUserCustomTokenBalance = async ({ provider, address }: any) => {
    const tokenContract = getTokenFactory({ provider });
    const userTokenAmount = await tokenContract.balanceOf(address);
    setUserCustomTokenBalance(userTokenAmount);
  };

  const getUserStakedAmount = async ({ provider, address }: any) => {
    const stakingContract = getStakingFactory({ provider });
    const userStakedAmount = await stakingContract.balanceOf(address);
    setUserStakedAmount(userStakedAmount);
  };

  const getTokenSymbol = async ({ provider }: any) => {
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
