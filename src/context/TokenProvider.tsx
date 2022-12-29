import { OwnerAddress } from '@config/contracts';
import { getNFTs } from '@utils/firebaseFunctions';
import { getNFTEditionFactory } from '@utils/web3';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

const TokenContext = createContext<any>(null);

export default function TokenProvider({ children }: any) {
  const [NFTData, setNFTData] = useState();
  const provider = useProvider();


  const _getNFTs = async () => {
    let resp: any = await getNFTs();
    resp = resp.docs.map((doc: any) => doc.data())
    const mappedNFTData: any = await setNFTsMetadata(resp);
    setNFTData(mappedNFTData)
  }

  const setNFTsMetadata = async (nfts: any) => {
    if (!nfts?.length) return;
    const NFTEditionContract = getNFTEditionFactory({ provider });
    return Promise.all(
      nfts.map(async (elem: any) => {
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
          ...elem,
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
