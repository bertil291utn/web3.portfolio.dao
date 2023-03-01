import ButtonComponent from '@components/common/Button.component';
import {
  getEth,
  NFTPage,
  tokenMainPage,
  tokenModal,
  tokenPageLabel,
} from '@placeholders/tokens.placeholder';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import {
  ClaimableContractAdd,
  ERC1155ContractAdd,
  ERC20TokenContractAdd,
} from 'src/config/contracts';
import ToastComponent from '@components/common/Toast.component';
import {
  getClaimableFactory,
  getNFT1155Factory,
  getTokenFactory,
} from '@utils/web3';
import { localStorageKeys } from '@keys/localStorage';
import { useRouter } from 'next/router';
import { useProvider } from 'wagmi';
import { useWalletContext } from '@context/WalletProvider';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { ethers } from 'ethers';
import LoadingComponent from '@components/common/Loading.component';
import NFTContent from '@layouts/NFTContent.component';
import { addNewDevice } from '@utils/firebaseFunctions';
import { Contract, signerOrProvider } from '@interfaces/provider'
import MintUserNFT from '@layouts/MintUserNFT.component';
import { variantType } from '@interfaces/toast';
import { useTokenProfileContext } from '@context/TokenProfileProvider';
import styles from './Token.module.scss';
import { getAllNFTs } from '@utils/NFT';
import ClaimTokens from '@layouts/ClaimTokens';


const TokensComponent = () => {
  const [showToast, setShowToast] = useState<boolean | string>(false);
  const provider = useProvider();
  const { address, isConnected: _isConnected } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [NFTBalance, setNFTBalance] = useState<number>(0);



  const _setNFTBalance = async (ownerAddress: string, provider: signerOrProvider) => {
    const NFT1155Contract = getNFT1155Factory(provider);
    let balance = await NFT1155Contract.balanceOfByOwner(ownerAddress);
    balance = Number(balance);
    balance != 0 && setNFTBalance(balance)
  }



  useEffect(() => {
    address && provider && _setNFTBalance(address, provider);
    return () => { setNFTBalance(0) }
  }, [address, provider]);

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);


  return isConnected != null ? (
    <>
      {isConnected && <>
        {NFTBalance > 0 &&
          <>
            <ClaimTokens
              setShowToast={setShowToast}
              isConnected={isConnected}
            />
          </>
        }
        {NFTBalance == 0 && <MintUserNFT />}
      </>}

      {/*TODO: if user has already claimed nft its erc20 tokens display dao component */}
      {!isConnected && < div className={styles['connect-btn']}>
        <span className={styles['title']}>{tokenMainPage.title}</span>
        <p dangerouslySetInnerHTML={{
          __html: tokenMainPage.description,
        }} />
        <ConnectButton showBalance={false} />
      </div>}
      <ToastComponent
        variant={'error'}
        show={showToast}
        setShow={setShowToast}
      >
        {showToast}
      </ToastComponent>
    </>
  ) : null;
};

export default TokensComponent;
//TODO-WIP: leave as 1155 and remoive rarity all collection, and change each token quantity should has only 5
//set fixed price added on 
