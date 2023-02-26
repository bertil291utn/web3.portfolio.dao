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
import { Contract } from '@interfaces/provider'
import MintUserNFT from '@layouts/MintUserNFT.component';
import { variantType } from '@interfaces/toast';
import { useTokenProfileContext } from '@context/TokenProfileProvider';
import styles from './Token.module.scss';
import { getAllNFTs } from '@utils/NFT';


const TokensComponent = () => {
  const [activeTknClaimHash, setActiveTknClaimHash] = useState<boolean>();
  const [activeNFTHash] = useState();
  const [showToast, setShowToast] = useState<boolean | string>(false);
  const [toastVariant, setToastVariant] = useState<variantType>('error');
  const [ethUserBalance, setEthUserBalance] = useState<number>(0);
  const { data: signer } = useSigner();
  const ctx = useWalletContext();
  const provider = useProvider();
  const { address, isConnected: _isConnected } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const TknCtx = useTokenProfileContext();
  const [NFTBalance, setNFTBalance] = useState<number>(0);

  const getBalance = async ({ signerOrProvider, address }: Contract) => {
    const userBalance = await signerOrProvider.getBalance(address);
    const _balance = ethers.utils.formatEther(userBalance?.toString());
    setEthUserBalance(+_balance);
  };

  const _setNFTBalance = async (ownerAddress: string) => {
    const NFTs = await getAllNFTs(ownerAddress, [ERC1155ContractAdd!]);
    NFTs!.ownedNfts.length > 0 && setNFTBalance(NFTs!.ownedNfts[0].balance)
  }

  useEffect(() => {
    address && getBalance({ signerOrProvider: provider, address });
    address && isFinishedTransferTx({ signerOrProvider: provider, address });
    address && _setNFTBalance(address);
    return () => { setNFTBalance(0) }
  }, [address]);

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);

  const router = useRouter();

  const isFinishedTransferTx = async ({ signerOrProvider, address }: Contract) => {
    const tokenContract = getTokenFactory(signerOrProvider);
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    tokenContract.on('Transfer', async (from: string, to: string) => {
      if (
        from?.toLowerCase() == ClaimableContractAdd?.toLowerCase() &&
        to?.toLowerCase() == address?.toLowerCase()
      ) {
        try {
          await addNewDevice(address, { isWeb3User: true })
          await finishTx();

        } catch (error: any) {
          setShowToast(error.message);
          setToastVariant('error');
        }
      }
    });
  };


  useEffect(() => {
    setActiveTknClaimHash(
      !!window.localStorage.getItem(localStorageKeys.claimingTxHash)
    );
  }, []);

  const setCloseCurrentTx = () => {
    window.localStorage.removeItem(localStorageKeys.claimingTxHash);
  };

  const finishTx = async () => {
    setCloseCurrentTx();
    router.push(`/${navbarElements.profile.label}`);
    await new Promise((r) => setTimeout(r, 2000));
    window.location.reload();
  };

  const getEths = (URL: string) => () => {
    URL && window.open(URL, '_tab');
  };

  const getTokensAction = async () => {
    if (!signer) return;
    try {
      const claimableContract = getClaimableFactory(signer);
      let tx = await claimableContract.claim(ERC20TokenContractAdd);
      window.localStorage.setItem(localStorageKeys.claimingTxHash, tx.hash);
      setActiveTknClaimHash(tx.hash);
      await tx.wait();
    } catch (error: any) {
      setCloseCurrentTx();
      setShowToast(error.reason?.replace('execution reverted:', ''));
      setToastVariant('error');
    }
  };

  return isConnected != null ? (
    <>
      {isConnected && <>
        {NFTBalance > 0 && <div className={styles['content']}>
          {!activeTknClaimHash && !activeNFTHash ? (
            <>
              <span className={styles['title']}>{tokenPageLabel.title}</span>
              {/* //todo: update and description and update smart contract */}
              <p
                className={styles['description']}
                dangerouslySetInnerHTML={{
                  __html: tokenPageLabel.description(ctx && ctx.tokenSymbol),
                }}
              />
              <div className={styles['button']}>
                {ethUserBalance > 0 && (
                  <ButtonComponent
                    className={styles['button__content']}
                    onClick={getTokensAction}
                  >
                    {tokenPageLabel.buttonLabel}
                  </ButtonComponent>
                )}
                {ethUserBalance <= 0.005 && isConnected && (
                  <ButtonComponent
                    className={styles['get-eth']}
                    buttonType='tertiary'
                    onClick={getEths(getEth.URL)}
                  >
                    {getEth.buttonLabel}
                  </ButtonComponent>
                )}
              </div>
            </>
          ) : (
            <LoadingComponent
              title={
                activeTknClaimHash ? tokenModal.claiming : NFTPage.transferringNFT
              }
              description={tokenModal.description}
              fullHeight
            />
          )}
        </div>}
        {NFTBalance == 0 && <MintUserNFT />}
      </>}


      {!isConnected && < div className={styles['connect-btn']}>
        <span className={styles['title']}>{tokenMainPage.title}</span>
        <p dangerouslySetInnerHTML={{
          __html: tokenMainPage.description,
        }} />
        <ConnectButton showBalance={false} />
      </div>}
      <ToastComponent
        variant={toastVariant || ''}
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
