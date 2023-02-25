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
  const [NFTBalance, setNFTBalance] = useState<number>(0);
  const provider = useProvider();
  const { address } = useAccount();



  const _getNFTs = async (ownerAddress: string) => {
    const NFTs = await getAllNFTs(ownerAddress, [ERC1155ContractAdd!]);
    setNFTBalance(NFTs!.ownedNfts.length)
    if (NFTs?.ownedNfts.length == 0) return;
    const respData: Array<TokenProfile> = NFTs!.ownedNfts.map((elem) => (
      {
        tokenId: Number(elem.tokenId),
        balance: elem.balance,
        name: elem.title,
        image: `https://gateway.pinata.cloud/ipfs/${elem.rawMetadata?.image}`,
        superRare: (elem.rawMetadata?.attributes!.find(elem => elem['trait_type'] == "Rarity")?.value || 0) >= 75,
        links: {
          opensea: `https://testnets.opensea.io/assets/goerli/${elem.contract.address}/${elem.tokenId}`,
          metadata: elem.tokenUri!.gateway
        }
      }));
    setNFTDataProfile(respData)
  }

  useEffect(() => {
    address && _getNFTs(address);
  }, [address])

  return (
    <TokenContext.Provider
      value={{
        NFTData,
        NFTBalance,
        NFTDataProfile,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useTokenContext = () => {
  return useContext(TokenContext);
};
