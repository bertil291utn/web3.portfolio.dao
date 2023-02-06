import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useProvider, useAccount } from 'wagmi';
import { getStakingFactory, getTokenFactory } from '@utils/web3';
import { DEFAULT_TOKEN_NAME } from '@constants/common';
import Context from '@interfaces/wallet';
import Props from '@interfaces/children';
import { IProvider } from '@interfaces/provider';


interface Contract extends IProvider {
  address: string
}


const WalletContext = createContext<Context | null>(null);

export default function WalletProvider({ children }: Props) {
  const [userCustomTokenBalance, setUserCustomTokenBalance] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const wallet = useAccount();
  const provider = useProvider();

  const getUserCustomTokenBalance = async ({ signerProvider, address }: Contract) => {
    const tokenContract = getTokenFactory({ signerProvider });
    const userTokenAmount = await tokenContract.balanceOf(address);
    setUserCustomTokenBalance(userTokenAmount);
  };

  const getUserStakedAmount = async ({ signerProvider, address }: Contract) => {
    const stakingContract = getStakingFactory({ signerProvider });
    const userStakedAmount = await stakingContract.balanceOf(address);
    setUserStakedAmount(userStakedAmount);
  };

  const getTokenSymbol = async ({ signerProvider }: IProvider) => {
    const tokenContract = getTokenFactory({ signerProvider });
    const tokenSymbol = await tokenContract.symbol();
    setTokenSymbol(tokenSymbol || DEFAULT_TOKEN_NAME);
  };

  useEffect(() => {
    wallet.isConnected && getUserCustomTokenBalance({ signerProvider: provider, address: wallet.address || '' });
    wallet.isConnected && getUserStakedAmount({ signerProvider: provider, address: wallet.address || '' });
    getTokenSymbol({ signerProvider: provider });
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
