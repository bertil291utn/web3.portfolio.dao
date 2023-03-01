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
  ERC1155ContractAdd
} from '@config/contracts';
import LoadingComponent from '@components/common/Loading.component';
import { localStorageKeys } from '@keys/localStorage';
import ToastComponent from '@components/common/Toast.component';
import { getAllNFTs } from '@utils/NFT';
import NFTProfileCard from '@components/common/NFTProfileCard.component';
import { Contract, signerOrProvider } from '@interfaces/provider';
import { TokenProfile } from '@interfaces/TokenProfile';
import { FinishTX, HandleError } from '@interfaces/transactions';
import { variantType } from '@interfaces/toast';
import { VscJson } from 'react-icons/vsc';
import { TbShip } from 'react-icons/tb';
import styles from './ProfileContent.module.scss';

const ProfileContent = () => {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>();
  const [tokenCards, setTokenCards] = useState<Array<TokenProfile>>([]);
  const [showToast, setShowToast] = useState<boolean | string>(false);
  const [toastVariant, setToastVariant] = useState<variantType>('error');
  const [activeApprovingHash, setActiveApprovingHash] = useState<boolean>();
  const [activeStakingHash, setActiveStakingHash] = useState<boolean>();
  const [activeUnStakingHash, setActiveUnStakingHash] = useState<boolean>();
  const ctx = useWalletContext();
  const [tokenAmount, setTokenAmount] = useState<string>();
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const setCurrentTxState = {
    [localStorageKeys.approveStakingTxHash]: setActiveApprovingHash,
    [localStorageKeys.stakingTxHash]: setActiveStakingHash,
    [localStorageKeys.unStakingTxHash]: setActiveUnStakingHash,
  };

  const listenEvents = ({ signerOrProvider, address }: Contract) => {
    const stakingContract = getStakingFactory(signerOrProvider);
    const tokenContract = getTokenFactory(signerOrProvider);
    //LISTENERS
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    tokenContract.on('Approval', async (owner, spender) => {
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

    stakingContract.on('Staked', async (user) => {
      if (user?.toLowerCase() == address?.toLowerCase()) {
        await finishTx({
          txHashKeyName: localStorageKeys.stakingTxHash,
          path: navbarElements.profile.label,
          reload: true,
        });
      }
    });

    stakingContract.on('Unstake', async (user) => {
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
    setIsWalletConnected(isConnected);
    address && setNFTsData(address);
    listenEvents({ signerOrProvider: provider, address: address || '' });
    return () => { setTokenCards([]) }
  }, [address]);

  const setNFTsData = async (ownerAddress: string) => {
    const response = await getAllNFTs(ownerAddress, [ERC1155ContractAdd!])

    if (response?.ownedNfts.length == 0) return;
    const respData: Array<TokenProfile> = response!.ownedNfts.map((elem) => (
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
    setTokenCards(respData);
  };

  const isFormValid = (stakingAmount: string) => {
    if (!stakingAmount) return false;
    if (Number(stakingAmount) <= 0) return false;
    //TODO: check stakingAmount is not greater than default staking amount
    //rn there's an input min and max
    return true;
  };

  const removeLocalStorageItem = (txHashKeyName: string) => {
    window.localStorage.removeItem(txHashKeyName);
  };

  const handleError = ({ error, txHashKeyName }: HandleError) => {
    removeLocalStorageItem(txHashKeyName);
    setShowToast(error.reason?.replace('execution reverted:', ''));
    setToastVariant('error');
    setCurrentTxState[txHashKeyName](false);
  };

  const finishTx = async ({ txHashKeyName, path, reload = false }: FinishTX) => {
    removeLocalStorageItem(txHashKeyName);
    setCurrentTxState[txHashKeyName](false);
    router.push(`/${path}`);
    await new Promise((r) => setTimeout(r, 2000));
    reload && window.location.reload();
  };

  const stakeAction = async () => {
    if (!signer) return;
    const stakingContract = getStakingFactory(signer);
    const tokenContract = getTokenFactory(signer);
    const allowanceAmount = await tokenContract.allowance(
      address,
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
    if (!signer) return
    const stakingContract = getStakingFactory(signer);
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

  const unStakingAction = (e: React.FormEvent<HTMLFormElement>) => {
    if (!tokenAmount) return;
    e.preventDefault();
    const _isFormValid = isFormValid(tokenAmount);
    _isFormValid && unStakeAction();
  };

  const stakingAction = (e: React.FormEvent<HTMLFormElement>) => {
    if (!tokenAmount) return;
    e.preventDefault();
    const _isFormValid = isFormValid(tokenAmount);
    _isFormValid && stakeAction();
  };

  const redirect = (link: string) => () => {
    link && window.open(link, '_blank')
  }

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
          {isWalletConnected && Number(ctx?.userCustomTokenBalance) != 0 && (
            <div className={styles['profile']}>
              <span className={`subtitle`}>{ProfileLabel.availableTokens}</span>
              <span>
                {`${ethers.utils.formatEther(
                  ctx?.userCustomTokenBalance || 0
                )} $${ctx?.tokenSymbol}`}
              </span>
            </div>
          )}
        </SectionPanel>

        {tokenCards?.length > 0 && (
          <SectionPanel
            id={IdContent.nfts}
            title={ProfileSections.NFTInfoTitle}
          >
            <div className={styles['cards']}>
              {tokenCards.map((elem) => (
                <div className={styles["card-container"]}
                  key={`card-${elem.tokenId}`}
                >
                  <NFTProfileCard
                    tokenId={elem.tokenId}
                    srcImage={elem.image}
                    name={elem.name}
                    balance={elem.balance}
                    superRare={elem.superRare}
                  />
                  <div className={styles['buttons-container']}>
                    <div className={styles['buttons-content']}>
                      <ButtonComponent title='Opensea' className={styles['opensea-button']} onClick={redirect(elem.links.opensea)} buttonType='rounded' LeftIcon={TbShip} />
                      <ButtonComponent title='Metadata' className={styles['metada-button']} onClick={redirect(elem.links.metadata)} buttonType='rounded' LeftIcon={VscJson} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* {ctx?.userCustomTokenBalance !== undefined && ctx?.userCustomTokenBalance > 0 && (
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
                    >
                      {
                        ctx?.userStakedAmount > 0 ? 'Unstake' : 'Stake'
                      }

                    </ButtonComponent>
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
        )} */}
      </div>
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

export default ProfileContent;
