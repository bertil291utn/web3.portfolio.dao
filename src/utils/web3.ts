import { Contract, ethers } from 'ethers';
import {
  ClaimableContractAdd,
  ERC20TokenContractAdd,
  ERC1155ContractAdd,
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
import BATL1155DAOTokenABI from '@web3/ABI/BATL1155DAOToken.json';
import ERC1155ClaimableABI from '@web3/ABI/ERC1155Claimable.json';
import { signerOrProvider } from '@interfaces/provider';


interface ContractFactory {
  address: string
  ABI: ethers.ContractInterface
  signerOrProvider: signerOrProvider
}

export const getContractFactory = ({ address, ABI, signerOrProvider }: ContractFactory) => {
  return new ethers.Contract(address, ABI, signerOrProvider);
};

export const getTokenFactory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: ERC20TokenContractAdd!,
    ABI: erc20ABI,
    signerOrProvider,
  });
};

export const getClaimableFactory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: ClaimableContractAdd!,
    ABI: ClaimableABI,
    signerOrProvider,
  });
};

export const getStakingFactory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: StakingContractAdd!,
    ABI: StakingABI,
    signerOrProvider
  });
};



export const getNFTEditionFactory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: NFTEditionContractAdd!,
    ABI: ERC1155ABI,
    signerOrProvider
  });
};

export const getNFTEditionClaimableFactory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: NFTEditionClaimableContractAdd!,
    ABI: ERC1155ClaimableABI,
    signerOrProvider
  });
};

export const getNFT1155Factory = (signerOrProvider: signerOrProvider) => {
  return getContractFactory({
    address: ERC1155ContractAdd!,
    ABI: BATL1155DAOTokenABI,
    signerOrProvider
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
