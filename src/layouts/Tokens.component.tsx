import ButtonComponent from '@components/common/Button.component';
import {
  getEth,
  NFTPage,
  tokenModal,
  tokenPageLabel,
} from '@placeholders/tokens.placeholder';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useSigner } from 'wagmi';
import {
  ClaimableContractAdd,
  ERC20TokenContractAdd,
  OwnerAddress,
} from 'src/config/contracts';
import ToastComponent from '@components/common/Toast.component';
import {
  getClaimableFactory,
  getNFTEditionFactory,
  getTokenFactory,
} from '@utils/web3';
import { localStorageKeys } from '@keys/localStorage';
import { useRouter } from 'next/router';
import { useProvider } from 'wagmi';
import { useWalletContext } from '@context/WalletProvider';
import { navbarElements } from '@placeholders/navbar.placeholders';
import styles from './Token.module.scss';
import { ethers } from 'ethers';
import LoadingComponent from '@components/common/Loading.component';
import NFTContent from '@layouts/NFTContent.component';
import { useTokenContext } from '@context/TokenProvider';
import { addNewDevice } from '@utils/firebaseFunctions';


const TokensComponent = ({ NFTData }: any) => {
  const { setNFTData } = useTokenContext();
  const [activeTknClaimHash, setActiveTknClaimHash] = useState<boolean>();
  const [activeNFTHash] = useState();
  const [showToast, setShowToast] = useState();
  const [toastVariant, setToastVariant] = useState<string>();
  const [ethUserBalance, setEthUserBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>();
  const { data: signer } = useSigner();
  const { userCustomTokenBalance, tokenSymbol } = useWalletContext();
  const provider = useProvider();
  const { address, isConnected: _isConnected } = useAccount();

  const getBalance = async ({ provider, address }: any) => {
    const userBalance = await provider.getBalance(address);
    const _balance = ethers.utils.formatEther(userBalance?.toString());
    setEthUserBalance(+_balance);
  };
  const setNFTsMetadata = async (nfts: any) => {
    if (!nfts?.length) return;
    const NFTEditionContract = getNFTEditionFactory({ provider });
    const resp = await Promise.all(
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
    setNFTData(resp);
  };

  useEffect(() => {
    address && getBalance({ provider, address });
    setNFTsMetadata(NFTData);
    isFinishedTransferTx({ provider, address });
  }, [address]);

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);

  const router = useRouter();

  const isFinishedTransferTx = async ({ provider, address }: any) => {
    const tokenContract = getTokenFactory({ provider });
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
    try {
      const claimableContract = getClaimableFactory({ signer });
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

  return (
    <>
      <div className={styles['content']}>
        {!activeTknClaimHash && !activeNFTHash ? (
          <>
            {(!isConnected || userCustomTokenBalance?.toString() <= 0) && (
              <>
                <span className={styles['title']}>{tokenPageLabel.title}</span>
                <p
                  className={styles['description']}
                  dangerouslySetInnerHTML={{
                    __html: tokenPageLabel.description(tokenSymbol),
                  }}
                />
                <div className={styles['button']}>
                  <div className={styles['user-connected-btn']}>
                    <ConnectButton showBalance={false} />
                  </div>
                  {ethUserBalance > 0 && (
                    <ButtonComponent
                      className={styles['button__content']}
                      buttonType='primary'
                      btnLabel={tokenPageLabel.buttonLabel}
                      onClick={getTokensAction}
                    />
                  )}
                  {ethUserBalance <= 0.005 && isConnected && (
                    <ButtonComponent
                      className={styles['get-eth']}
                      buttonType='tertiary'
                      btnLabel={getEth.buttonLabel}
                      onClick={getEths(getEth.URL)}
                    />
                  )}
                </div>
              </>
            )}
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
      </div>
      {isConnected &&
        userCustomTokenBalance?.toString() > 0 &&
        !activeTknClaimHash &&
        !activeNFTHash && (
          <>
            <NFTContent />
          </>
        )}
      <ToastComponent
        variant={toastVariant}
        show={showToast}
        setShow={setShowToast}
      >
        {showToast}
      </ToastComponent>
    </>
  );
};

export default TokensComponent;
