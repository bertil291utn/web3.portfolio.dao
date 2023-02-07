import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { useWalletContext } from '@context/WalletProvider';
import {
  IdContent,
  ProfileLabel,
  profileLoading,
  ProfileSections,
} from '@placeholders/profile.placeholder';
import ButtonComponent from '@components/common/Button.component';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { useRouter } from 'next/router';
import styles from './ProfileContent.module.scss';
import SectionPanel from '@components/common/SectionPanel.component';
import { defaultStakingAmount, minStakingAmount } from '@constants/common';
import InputComponent from '@components/common/Input.component';
import {
  getNFTEditionFactory,
  getStakingFactory,
  getTokenFactory,
} from '@utils/web3';
import {
  ERC20TokenContractAdd,
  NFTEditionContractAdd,
  StakingContractAdd,
} from '@config/contracts';
import LoadingComponent from '@components/common/Loading.component';
import { localStorageKeys } from '@keys/localStorage';
import ToastComponent from '@components/common/Toast.component';
import { getAllNFTs } from '@utils/NFT';
import NFTProfileCard from '@components/common/NFTProfileCard.component';
import { Contract } from '@interfaces/provider';

const ProfileContent = () => {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>();
  const [tokenCards, setTokenCards] = useState<any>();
  const [showToast, setShowToast] = useState<any>();
  const [toastVariant, setToastVariant] = useState<string>();
  const [activeApprovingHash, setActiveApprovingHash] = useState<boolean>();
  const [activeStakingHash, setActiveStakingHash] = useState<boolean>();
  const [activeUnStakingHash, setActiveUnStakingHash] = useState<boolean>();
  const ctx = useWalletContext();
  const [tokenAmount, setTokenAmount] = useState<string>();
  const acct = useAccount();
  const signer = useSigner();
  const provider = useProvider();

  const setCurrentTxState = {
    [localStorageKeys.approveStakingTxHash]: setActiveApprovingHash,
    [localStorageKeys.stakingTxHash]: setActiveStakingHash,
    [localStorageKeys.unStakingTxHash]: setActiveUnStakingHash,
  };

  const listenEvents = ({ signerProvider, address }: Contract) => {
    const stakingContract = getStakingFactory({ signerProvider });
    const tokenContract = getTokenFactory({ signerProvider });
    //LISTENERS
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    tokenContract.on('Approval', async (owner: string, spender: string) => {
      if (
        owner?.toLowerCase() == address?.toLowerCase() &&
        spender?.toLowerCase() == StakingContractAdd?.toLowerCase()
      ) {
        await finishTx({
          txHashKeyName: localStorageKeys.approveStakingTxHash,
          path: navbarElements.profile.label,
        });
      }
    });

    stakingContract.on('Staked', async (user: string) => {
      if (user?.toLowerCase() == address?.toLowerCase()) {
        await finishTx({
          txHashKeyName: localStorageKeys.stakingTxHash,
          path: navbarElements.profile.label,
          reload: true,
        });
      }
    });

    stakingContract.on('Unstake', async (user: string) => {
      if (user?.toLowerCase() == address?.toLowerCase()) {
        await finishTx({
          txHashKeyName: localStorageKeys.unStakingTxHash,
          path: navbarElements.profile.label,
          reload: true,
        });
      }
    });
  };
  //TODO: add link to display tokens on metamask
  //https://ethereum.stackexchange.com/questions/99343/how-to-automatically-add-a-custom-token-to-metamask-with-ethers-js

  const _getNFTs = async (ownerAddress: string) => {
    if (!signer.data) return;
    const NFTTokenContract = getNFTEditionFactory({ signerProvider: signer.data });
    let resp: any = await getAllNFTs(ownerAddress);
    if (!resp) return;
    resp = resp.ownedNfts.filter(
      (elem: any) =>
        elem.contract.address.toLowerCase() ===
        NFTEditionContractAdd?.toLowerCase()
    );
    if (resp.length) {
      const respData = resp.map((elem: any) => ({ tokenId: elem.tokenId, quantity: elem.balance }));
      const _tokenCards = await Promise.all(
        respData.map(async ({ tokenId, quantity }: any) => {
          const tokenURI = await NFTTokenContract.uri(+tokenId);
          if (!tokenURI) return null; /* it means setUri function has been set tup before*/
          const res = await fetch(tokenURI);
          const tokenURIResp = await res.json();
          return { ...tokenURIResp, tokenId, quantity };
        })
      );
      setTokenCards(_tokenCards.filter((elem: any) => elem));
    }
  };

  useEffect(() => {
    setActiveApprovingHash(
      !!window.localStorage.getItem(localStorageKeys.approveStakingTxHash)
    );
    setActiveStakingHash(
      !!window.localStorage.getItem(localStorageKeys.stakingTxHash)
    );
    setActiveUnStakingHash(
      !!window.localStorage.getItem(localStorageKeys.unStakingTxHash)
    );
  }, []);

  useEffect(() => {
    if (!ctx?.userStakedAmount) return;
    const _tokenInputVal =
      ctx?.userStakedAmount <= 0
        ? (minStakingAmount).toString()
        : ctx.userStakedAmount &&
        ethers.utils.formatEther(ctx.userStakedAmount?.toString()) || '';
    setTokenAmount(_tokenInputVal);
  }, [ctx?.userStakedAmount]);

  useEffect(() => {
    setIsWalletConnected(acct.isConnected);
    _getNFTs(acct.address ?? '');
    listenEvents({ signerProvider: provider, address: acct.address || '' });
  }, [acct.address]);

  const isFormValid = ({ stakingAmount }: any) => {
    if (!stakingAmount) return false;
    if (stakingAmount <= 0) return false;
    //TODO: check stakingAmount is not greater than default staking amount
    //rn there's an input min and max
    return true;
  };

  const removeLocalStorageItem = (txHashKeyName: string) => {
    window.localStorage.removeItem(txHashKeyName);
  };

  const handleError = ({ error, txHashKeyName }: any) => {
    removeLocalStorageItem(txHashKeyName);
    setShowToast(error.reason?.replace('execution reverted:', ''));
    setToastVariant('error');
    setCurrentTxState[txHashKeyName](false);
  };

  const finishTx = async ({ txHashKeyName, path, reload = false }: any) => {
    removeLocalStorageItem(txHashKeyName);
    setCurrentTxState[txHashKeyName](false);
    router.push(`/${path}`);
    await new Promise((r) => setTimeout(r, 2000));
    reload && window.location.reload();
  };

  const stakeAction = async () => {
    if (!signer.data) return;
    const stakingContract = getStakingFactory({ signerProvider: signer.data });
    const tokenContract = getTokenFactory({ signerProvider: signer.data });
    const allowanceAmount = await tokenContract.allowance(
      acct.address,
      StakingContractAdd
    );

    let tx;
    //TODO: it might not be necessary this check bc the staking tx is gonna be done just once
    if (allowanceAmount?.toString() <= 0) {
      try {
        tx = await tokenContract.approve(
          StakingContractAdd,
          ethers.utils.parseEther(defaultStakingAmount.toString())
        );
        window.localStorage.setItem(
          localStorageKeys.approveStakingTxHash,
          tx.hash
        );
        setActiveApprovingHash(tx.hash);
        await tx.wait();
      } catch (error) {
        handleError({
          error,
          txHashKeyName: localStorageKeys.approveStakingTxHash,
        });
        return;
      }
    }

    try {
      tx = await stakingContract.stake(
        ethers.utils.parseEther(tokenAmount?.toString() ?? ''),
        ERC20TokenContractAdd
      );
      setActiveStakingHash(tx.hash);
      window.localStorage.setItem(localStorageKeys.stakingTxHash, tx.hash);
      await tx.wait();
    } catch (error) {
      handleError({
        error,
        txHashKeyName: localStorageKeys.stakingTxHash,
      });
    }
  };

  const unStakeAction = async () => {
    if (!signer.data) return
    const stakingContract = getStakingFactory({ signerProvider: signer.data });
    let tx;
    try {
      tx = await stakingContract.unstake(
        ethers.utils.parseEther(tokenAmount?.toString() ?? ''),
        ERC20TokenContractAdd
      );
      window.localStorage.setItem(localStorageKeys.unStakingTxHash, tx.hash);
      setActiveUnStakingHash(tx.hash);
      await tx.wait();
    } catch (error) {
      handleError({
        error,
        txHashKeyName: localStorageKeys.unStakingTxHash,
      });
    }
  };

  const unStakingAction = (e: any) => {
    e.preventDefault();
    const _isFormValid = isFormValid({ stakingAmount: tokenAmount });
    _isFormValid && unStakeAction();
  };

  const stakingAction = (e: any) => {
    e.preventDefault();
    const _isFormValid = isFormValid({ stakingAmount: tokenAmount });
    _isFormValid && stakeAction();
  };

  return (
    <>
      <div className={styles['content']}>
        <SectionPanel
          id={IdContent.walletInfo}
          title={ProfileSections.walletInfoTitle}
          subtitle={ProfileSections.walletInfoSubtitle}
        >
          <div className={styles['connect-btn']}>
            <ConnectButton showBalance={false} />
          </div>
          {isWalletConnected && (
            <div className={styles['profile']}>
              <span className={`subtitle`}>{ProfileLabel.availableTokens}</span>
              <span>
                {`${ethers.utils.formatEther(
                  ctx?.userCustomTokenBalance || 0
                )} $${ctx?.tokenSymbol}`}
              </span>
              {ctx?.userCustomTokenBalance == 0 && (
                <div className={styles['claim-btn']}>
                  <ButtonComponent
                    onClick={() =>
                      router.push(`${navbarElements.tokens.path}`)
                    }
                    buttonType='primary'
                    btnLabel={ProfileLabel.claimTokens}
                  />
                </div>
              )}
            </div>
          )}
        </SectionPanel>

        {tokenCards?.length > 0 && (
          <SectionPanel
            id={IdContent.nfts}
            title={ProfileSections.NFTInfoTitle}
            subtitle={ProfileSections.NFTInfoSubtitle}
          >
            <div className={styles['cards']}>
              {tokenCards.map((elem: any) => (
                <NFTProfileCard
                  key={`card-${elem.tokenId}`}
                  tokenId={elem.tokenId}
                  srcImage={elem.image}
                  name={elem.name}
                  quantity={elem.quantity}
                  superRare={elem.attributes[0].value > 70}
                />
              ))}
            </div>
          </SectionPanel>
        )}

        {ctx?.userCustomTokenBalance !== undefined && ctx?.userCustomTokenBalance > 0 && (
          <SectionPanel
            id={IdContent.staking}
            title={ProfileSections.stakingSectionTitle}
            subtitle={ProfileSections.stakingSectionSubtitle(ctx?.tokenSymbol)}
          >
            {!activeApprovingHash &&
              !activeStakingHash &&
              !activeUnStakingHash && (
                <div className={styles['staking']}>
                  <form
                    onSubmit={
                      ctx?.userStakedAmount > 0
                        ? unStakingAction
                        : stakingAction
                    }
                    className={styles['form']}
                  >
                    <InputComponent
                      className={styles['input']}
                      type='number'
                      name='tokenAmount'
                      value={tokenAmount || ''}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      min={'1'}
                      max={
                        ctx?.userStakedAmount > 0
                          ? ethers.utils.formatEther(ctx?.userStakedAmount || 0)
                          : '100'
                      }
                    />
                    <ButtonComponent
                      className={styles['button']}
                      type={'submit'}
                      buttonType={'primary'}
                      btnLabel={
                        ctx?.userStakedAmount > 0 ? 'Unstake' : 'Stake'
                      }
                    />
                  </form>
                  {ctx?.userStakedAmount > 0 && (
                    <div>
                      <span className={`subtitle`}>
                        {ProfileLabel.stakedTokens}
                      </span>
                      <span>
                        {`${ethers.utils.formatEther(
                          (ctx?.userStakedAmount).toString()
                        )} $${ctx.tokenSymbol}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            {
              <>
                {activeApprovingHash && (
                  <LoadingComponent
                    title={profileLoading.approving}
                    description={profileLoading.approvingDescription}
                  />
                )}
                {activeStakingHash && (
                  <LoadingComponent title={profileLoading.staking} />
                )}
                {activeUnStakingHash && (
                  <LoadingComponent title={profileLoading.unStaking} />
                )}
              </>
            }
          </SectionPanel>
        )}
      </div>
      <ToastComponent
        variant={toastVariant||''}
        show={showToast}
        setShow={setShowToast}
      >
        {showToast}
      </ToastComponent>
    </>
  );
};

export default ProfileContent;
