import ButtonComponent from '@components/common/Button.component';
import LoadingComponent from '@components/common/Loading.component';
import { ERC1155ContractAdd } from '@config/contracts';
import { useWalletContext } from '@context/WalletProvider';
import { Contract } from '@interfaces/provider';
import { localStorageKeys } from '@keys/localStorage';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { getEth, NFTPage, tokenModal, tokenPageLabel } from '@placeholders/tokens.placeholder';
import { addNewDevice } from '@utils/firebaseFunctions';
import { getTokenFactory } from '@utils/web3';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';
import styles from './ClaimTokens.module.scss';



const ClaimTokens = ({ setShowToast, isConnected }: Props) => {
  const [activeTknClaimHash, setActiveTknClaimHash] = useState<boolean>();
  const [activeNFTHash] = useState();
  const [ethUserBalance, setEthUserBalance] = useState<number>(0);
  const { data: signer } = useSigner();
  const ctx = useWalletContext();
  const { address } = useAccount();
  const provider = useProvider();

  const getBalance = async ({ signerOrProvider, address }: Contract) => {
    const userBalance = await signerOrProvider.getBalance(address);
    const _balance = ethers.utils.formatEther(userBalance?.toString());
    setEthUserBalance(+_balance);
  };

  useEffect(() => {
    address && getBalance({ signerOrProvider: provider, address });
    address && isFinishedTransferTx({ signerOrProvider: provider, address });
  }, [address]);


  const isFinishedTransferTx = async ({ signerOrProvider, address }: Contract) => {
    const tokenContract = getTokenFactory(signerOrProvider);
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    tokenContract.on('Transfer', async (from, to) => {
      if (
        from?.toLowerCase() == ethers.constants.AddressZero &&
        to?.toLowerCase() == address?.toLowerCase()
      ) {
        try {
          await addNewDevice(address, { isWeb3User: true })
          await finishTx();

        } catch (error: any) {
          setShowToast(error.message);
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

  const router = useRouter();
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
      const ERC20TokenContract = getTokenFactory(signer);
      let tx = await ERC20TokenContract.claim(ERC1155ContractAdd);
      window.localStorage.setItem(localStorageKeys.claimingTxHash, tx.hash);
      setActiveTknClaimHash(tx.hash);
      await tx.wait();
    } catch (error: any) {
      setCloseCurrentTx();
      setShowToast(error.reason?.replace('execution reverted:', ''));
    }
  };

  return (

    <div className={styles['content']}>
      {!activeTknClaimHash && !activeNFTHash ? (
        <>
          <span className={styles['title']}>{tokenPageLabel.title}</span>
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
    </div>
  );
}

export default ClaimTokens;

interface Props {
  setShowToast: React.Dispatch<React.SetStateAction<boolean | string>>
  isConnected: boolean
}