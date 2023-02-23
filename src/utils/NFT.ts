import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

export const getAllNFTs = (ownerAddress: string, pageKey?: string) => {
  if (!ownerAddress) return;
  return alchemy.nft.getNftsForOwner(ownerAddress, { pageKey });
};
