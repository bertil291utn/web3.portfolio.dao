import LoadingComponent from '@components/common/Loading.component';
import NFTCard from '@components/common/NFTCard.component';
import { defaultStakingAmount } from '@constants/common';
import { useTokenContext } from '@context/TokenProvider';
import { useWalletContext } from '@context/WalletProvider';
import {
  getNFTEditionClaimableFactory,
  getNFTEditionFactory,
  getTokenFactory,
} from '@utils/web3';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import {
  ERC20TokenContractAdd,
  NFTEditionClaimableContractAdd,
  NFTEditionContractAdd,
  OwnerAddress,
} from '@config/contracts';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { NFTPage, NFTTokensLoading } from '@placeholders/tokens.placeholder';
import styles from './NFTContent.module.scss';
import ToastComponent from '@components/common/Toast.component';
import { localStorageKeys } from '@keys/localStorage';
import { useRouter } from 'next/router';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { IdContent } from '@placeholders/profile.placeholder';

const NFTContent = () => {
  const router = useRouter();
  const [activeApprovingHash, setActiveApprovingHash] = useState<boolean | undefined | null>();
  const [activeClaimingHash, setActiveClaimingHash] = useState<boolean | undefined | null>();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastVariant, setToastVariant] = useState<string>();
  const signer = useSigner();
  const { address } = useAccount();
  const [NFTData, setNFTData] = useState<any>();
  const ctx = useWalletContext();
  const { NFTData: _NFTData } = useTokenContext();
  const provider = useProvider();

  const listenEvents = ({ provider, address }: any) => {
    const NFTEditionContract = getNFTEditionFactory({
      signerProvider: provider,
    });
    const tokenContract = getTokenFactory({ signerProvider: provider });

    tokenContract.on('Approval', async (owner: string, spender: string) => {
      if (
        owner?.toLowerCase() == address?.toLowerCase() &&
        spender?.toLowerCase() == NFTEditionClaimableContractAdd?.toLowerCase()
      ) {
        await finishTx({
          txHashKeyName: localStorageKeys.approveClaimingNFTTokenTxHash,
          path: navbarElements.tokens.path,
        });
      }
    });

    NFTEditionContract.on('TransferSingle', async (_: any, from: string, to: string) => {
      if (
        from?.toLowerCase() == OwnerAddress?.toLowerCase() &&
        to?.toLowerCase() == address?.toLowerCase()
      ) {
        await finishTx({
          txHashKeyName: localStorageKeys.claimingNFTTokenTxHash,
          path: `${navbarElements.profile.path}#${IdContent.nfts}`,
          reload: true,
        });
      }
    });
  };

  useEffect(() => {
    setActiveApprovingHash(
      !!window.localStorage.getItem(
        localStorageKeys.approveClaimingNFTTokenTxHash
      )
    );
    setActiveClaimingHash(
      !!window.localStorage.getItem(localStorageKeys.claimingNFTTokenTxHash)
    );
  }, []);

  useEffect(() => {
    listenEvents({ provider, address });
  }, [address]);

  const finishTx = async ({ txHashKeyName, path, reload = false }: any) => {
    removeLocalStorageItem(txHashKeyName);
    setCurrentTxState[txHashKeyName](null);
    router.push(`${path}`);
    await new Promise((r) => setTimeout(r, 2000));
    reload && window.location.reload();
  };

  const removeLocalStorageItem = (txHashKeyName: string) => {
    window.localStorage.removeItem(txHashKeyName);
  };

  const setCurrentTxState = {
    [localStorageKeys.approveClaimingNFTTokenTxHash]: setActiveApprovingHash,
    [localStorageKeys.claimingNFTTokenTxHash]: setActiveClaimingHash,
  };

  const handleError = ({ error, txHashKeyName }: any) => {
    removeLocalStorageItem(txHashKeyName);
    setShowToast(error.reason?.replace('execution reverted:', ''));
    setToastVariant('error');
    setCurrentTxState[txHashKeyName](null);
  };

  const getToken = (tokenId: number) => async () => {
    const NFTEditionContract = getNFTEditionFactory({ signerProvider: provider });
    if (!signer.data) return;
    const NFTClaimableEditionContract = getNFTEditionClaimableFactory({
      signerProvider: signer.data,
    });
    const tokenContract = getTokenFactory({ signerProvider: signer.data });

    let tx;
    try {
      const tokenPrice = await NFTEditionContract.getTokenPrice(tokenId);
      const allowanceAmount = await tokenContract.allowance(
        address,
        NFTEditionClaimableContractAdd
      );

      //if claimable nft 1155 was not approved then approve
      if (tokenPrice > 0 && allowanceAmount?.toString() == 0) {
        tx = await tokenContract.approve(
          NFTEditionClaimableContractAdd,
          ethers.utils.parseEther(defaultStakingAmount.toString())
        );
        window.localStorage.setItem(
          localStorageKeys.approveClaimingNFTTokenTxHash,
          tx.hash
        );
        setActiveApprovingHash(tx.hash);
        await tx.wait();
      }
      tx = await NFTClaimableEditionContract.mintUser(
        tokenId,
        NFTEditionContractAdd,
        ERC20TokenContractAdd,
        OwnerAddress
      );
      window.localStorage.setItem(
        localStorageKeys.claimingNFTTokenTxHash,
        tx.hash
      );
      setActiveClaimingHash(tx.hash);
      await tx.wait();
    } catch (error) {
      handleError({
        error,
        txHashKeyName: localStorageKeys.claimingNFTTokenTxHash,
      });
    }
  };

  useEffect(() => {
    setNFTData(_NFTData);
  }, [_NFTData]);

  return (
    <>
      {!activeApprovingHash && !activeClaimingHash && (
        <div className={styles['container']}>
          <div className={styles['header']}>
            <span className={styles['title']}>{NFTPage.title}</span>
            <p className={styles['description']}>
              {NFTPage.description(ctx!.tokenSymbol)}
            </p>
          </div>
          <div className={styles['cards']}>
            {NFTData?.map((elem: any, index: number) => {
              return !elem.allMinted ? (
                <NFTCard
                  className={styles['card-item']}
                  key={`card-${++index}`}
                  srcImage={elem.image}
                  name={elem.name}
                  price={`${elem.free ? 0 : elem.price} ${ctx?.tokenSymbol}`}
                  superRare={elem.superRare}
                  isFree={elem.free}
                  onClick={getToken(elem.id)}
                  quantityLeft={elem.quantityLeft}
                  totalSupply={elem.totalSupply}
                />
              ) : null;
            })}
          </div>
        </div>
      )}
      <>
        {activeApprovingHash && (
          <LoadingComponent
            title={NFTTokensLoading.approving}
            description={NFTTokensLoading.approvingDescription}
            fullHeight
          />
        )}
        {activeClaimingHash && (
          <LoadingComponent title={NFTTokensLoading.claiming} fullHeight />
        )}
      </>
      <ToastComponent
        variant={toastVariant || ''}
        show={showToast}
        setShow={setShowToast}
      >
        {showToast}
      </ToastComponent>
    </>
  );
};

export default NFTContent;
