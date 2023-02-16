import { ethers } from 'ethers';
import {
  ClaimableContractAdd,
  ERC20TokenContractAdd,
  NFTEditionClaimableContractAdd,
  NFTEditionContractAdd,
  StakingContractAdd,
} from '@config/contracts';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  erc20ABI,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import ClaimableABI from '@web3/ABI/Claimable.json';
import StakingABI from '@web3/ABI/StakingToken.json';
import ERC1155ABI from '@web3/ABI/ERC1155.json';
import ERC1155ClaimableABI from '@web3/ABI/ERC1155Claimable.json';
import { IProvider } from '@interfaces/provider';


interface ContractFactory extends IProvider {
  address: string
  ABI: ethers.ContractInterface
}

export const getContractFactory = ({ address, ABI, signerProvider }: ContractFactory) => {
  return new ethers.Contract(address, ABI, signerProvider);
};

export const getTokenFactory = ({ signerProvider }: IProvider) => {
  return getContractFactory({
    address: ERC20TokenContractAdd || '',
    ABI: erc20ABI,
    signerProvider,
  });
};

export const getClaimableFactory = ({ signerProvider }: IProvider) => {
  return getContractFactory({
    address: ClaimableContractAdd || '',
    ABI: ClaimableABI,
    signerProvider,
  });
};

export const getStakingFactory = ({ signerProvider }: IProvider) => {
  return getContractFactory({
    address: StakingContractAdd || '',
    ABI: StakingABI,
    signerProvider
  });
};
//


export const getNFTEditionFactory = ({ signerProvider }: IProvider) => {
  return getContractFactory({
    address: NFTEditionContractAdd || '',
    ABI: ERC1155ABI,
    signerProvider
  });
};

export const getNFTEditionClaimableFactory = ({ signerProvider }: IProvider) => {
  return getContractFactory({
    address: NFTEditionClaimableContractAdd || '',
    ABI: ERC1155ClaimableABI,
    signerProvider
  });
};

const configProvDev = [
  alchemyProvider({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    stallTimeout: 1_000,
    priority: 1,
  }),
  publicProvider({ priority: 0, stallTimeout: 2_000 }),
];
const configProvProd = [
  //TODO: check alchemy provider urls
  // it gives post error many times like an loop
  // alchemyProvider({
  //   apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  //   priority: 1,
  // }),
  infuraProvider({
    apiKey: process.env.NEXT_PUBLIC_INFURA_GOERLI_API_KEY,
    priority: 0,
  }),
];
const { chains, provider } = configureChains(
  [chain.goerli],
  process.env.NEXT_PUBLIC_ENV?.toLocaleLowerCase() == 'dev'
    ? configProvDev
    : configProvProd
);

export const chainProv = chains;

const { connectors } = getDefaultWallets({
  appName: 'Bertil portfolio',
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});
