import { ERC1155ContractAdd, OwnerAddress } from '@config/contracts';
import ChildrenType from '@interfaces/children';
import firebase from 'firebase/compat/app'
import { getNFTs } from '@utils/firebaseFunctions';
import { getNFTEditionFactory } from '@utils/web3';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useProvider } from 'wagmi';
import { ITokenContext, TokenElem } from '@interfaces/TokenProvider';
import { getAllNFTs } from '@utils/NFT';
import { TokenProfile } from '@interfaces/TokenProfile';



const TokenContext = createContext<ITokenContext | null>(null);

export default function TokenProfileProvider({ children }: ChildrenType) {
  const [NFTData, setNFTData] = useState<Array<TokenElem>>([]);
  const [NFTDataProfile, setNFTDataProfile] = useState<Array<TokenProfile>>([]);
  
  const provider = useProvider();
  const { address } = useAccount();



 

  return (
    <TokenContext.Provider
      value={{
        NFTData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useTokenProfileContext = () => {
  return useContext(TokenContext);
};
