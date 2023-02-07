import { OwnerAddress } from '@config/contracts';
import ChildrenType from '@interfaces/children';
import { TokenElem, Context } from '@interfaces/tokenProvider';
import firebase from 'firebase/compat/app'
import { getNFTs } from '@utils/firebaseFunctions';
import { getNFTEditionFactory } from '@utils/web3';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { useProvider } from 'wagmi';



const TokenContext = createContext<Context | null>(null);

export default function TokenProvider({ children }: ChildrenType) {
  const [NFTData, setNFTData] = useState<Array<TokenElem>>([]);
  const provider = useProvider();


  const _getNFTs = async () => {
    const firebaseNFTs = await getNFTs();
    const mappedNFTs = firebaseNFTs.docs.map((doc) => doc.data())
    const mappedNFTData = await setNFTsMetadata(mappedNFTs)
    setNFTData(mappedNFTData)
  }

  const setNFTsMetadata = async (nfts: firebase.firestore.DocumentData[]) => {
    if (!nfts?.length) return [];
    const NFTEditionContract = getNFTEditionFactory({ signerProvider: provider });
    return Promise.all(
      nfts.map(async (elem) => {
        const ownerBalance = await NFTEditionContract.balanceOf(
          OwnerAddress,
          elem.id
        );
        const totalSupply = (
          await NFTEditionContract.totalSupply(elem.id)
        ).toString();
        const quantityLeft = ownerBalance.toString();
        const allMinted = ownerBalance.toString() == 0;
        let price = await NFTEditionContract.getTokenPrice(elem.id);
        price = ethers.utils.formatEther(price).toString();
        return {
          id: elem.id,
          image: elem.image,
          name: elem.name,
          description: elem.description,
          attributes: elem.attributes,
          allMinted,
          quantityLeft,
          totalSupply,
          price,
          free: price <= 0,
        };
      })
    );
  };

  useEffect(() => {
    _getNFTs();

  }, [])

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

export const useTokenContext = () => {
  return useContext(TokenContext);
};
