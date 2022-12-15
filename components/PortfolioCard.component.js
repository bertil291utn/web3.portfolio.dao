import styles from './PortfolioCard.module.scss';
import { TbWorld } from 'react-icons/tb';
import { AiFillGithub, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { localStorageKeys } from '@keys/localStorage';
import ModalComponent from '@components/common/Modal.component';
import { useWalletContext } from '@context/WalletProvider';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { useRouter } from 'next/router';
import {
  PortfolioCardLabel,
  PortfolioLabel,
} from '@placeholders/portfolio.placeholder';
import { IdContent } from '@placeholders/profile.placeholder';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { getRatingFactory } from '@utils/web3';
import ToastComponent from '@components/common/Toast.component';
import LoadingComponent from '@components/common/Loading.component';
import { isTokenCheckPassed } from '@utils/common';

const PortfolioCard = ({
  projectId,
  type,
  description,
  projectName,
  overview,
  github,
  isRated,
}) => {
  const { userCustomTokenBalance, userStakedAmount, tokenSymbol } =
    useWalletContext();
  const [claimTokensModal, setClaimTokensModal] = useState(false);
  const [stakeTokensModal, setStakeTokensModal] = useState(false);
  const [isStakeHolder, setIsStakeHolder] = useState(false);
  const [toastVariant, setToastVariant] = useState();
  const [showToast, setShowToast] = useState();
  const [activeRatingHash, setActiveRatingHash] = useState();
  const [activeUnRatingHash, setActiveUnRatingHash] = useState();

  const { resolvedTheme } = useTheme();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { address } = useAccount();

  const listenEvents = ({ provider, address }) => {
    const ratingContract = getRatingFactory({ provider });
    //TODO: listen transfer event not just in rating component, but also all over the app _app file
    ratingContract.on('RatedProject', async (from, rated) => {
      if (from?.toLowerCase() == address?.toLowerCase()) {
        await finishTx({
          txHashKeyName: rated
            ? localStorageKeys.ratingTxHash
            : localStorageKeys.unRatingTxHash,
          path: '',
          reload: true,
        });
      }
    });
  };

  const removeLocalStorageItem = (txHashKeyName) => {
    window.localStorage.removeItem(txHashKeyName);
  };

  const finishTx = async ({ txHashKeyName, path, reload = false }) => {
    removeLocalStorageItem(txHashKeyName);
    setActiveRatingHash();
    setActiveRatingHash();
    router.push(`/${path}`);
    await new Promise((r) => setTimeout(r, 2000));
    reload && window.location.reload();
  };

  useEffect(() => {
    setMounted(true);

    !isRated &&
      setActiveRatingHash(
        !!window.localStorage.getItem(localStorageKeys.ratingTxHash)
      );
    isRated &&
      setActiveUnRatingHash(
        !!window.localStorage.getItem(localStorageKeys.unRatingTxHash)
      );
  }, []);

  useEffect(() => {
    listenEvents({ provider, address });
  }, [address]);

  useEffect(() => {
    setIsStakeHolder(userStakedAmount?.toString() > 0);
  }, [userStakedAmount]);

  if (!mounted) {
    return null;
  }

  const openURL = (URL) => () => {
    const _isTokenCheckPassed = isTokenCheckPassed({
      setClaimTokensModal,
      setStakeTokensModal,
      userCustomTokenBalance,
      isStakeHolder,
    });
    _isTokenCheckPassed && window.open(URL, '_blank');
  };

  const handleError = ({ error, txHashKeyName }) => {
    removeLocalStorageItem(txHashKeyName);
    setShowToast(error.reason?.replace('execution reverted:', ''));
    setToastVariant('error');
    !isRated && setActiveRatingHash();
    isRated && setActiveUnRatingHash();
  };

  const rateProject = async () => {
    if (!window.localStorage.getItem(localStorageKeys.isWeb3User)) {
      setClaimTokensModal(true);
      return;
    }
    const rateContract = getRatingFactory({ signer });
    let tx;
    const _isTokenCheckPassed = isTokenCheckPassed({
      setClaimTokensModal,
      setStakeTokensModal,
      userCustomTokenBalance,
      isStakeHolder,
    });
    if (_isTokenCheckPassed) {
      try {
        tx = await rateContract.rateProject(projectId, !isRated);
        !isRated && setActiveRatingHash(tx.hash);
        isRated && setActiveUnRatingHash(tx.hash);
        !isRated &&
          window.localStorage.setItem(localStorageKeys.ratingTxHash, tx.hash);
        isRated &&
          window.localStorage.setItem(localStorageKeys.unRatingTxHash, tx.hash);

        await tx.wait();
      } catch (error) {
        handleError({
          error,
          txHashKeyName: localStorageKeys.ratingTxHash,
        });
      }
    }
  };

  const claimAcceptBtnAction = () => {
    router.push(`/${navbarElements.tokens.label}`);
  };

  const stakeAcceptBtnAction = () => {
    router.push(`/${navbarElements.profile.label}#${IdContent.staking}`);
  };

  return (
    <>
      <div
        className={`${styles['card-content']} ${
          resolvedTheme === 'dark' ? styles['card-content__dark'] : ''
        }`}
      >
        {!activeRatingHash && !activeUnRatingHash && (
          <>
            <div>
              <span className={styles['card-content__tech']}>{type}</span>
              <span className={styles['card-content__project']}>
                {projectName}
              </span>
              <span className={styles['card-content__description']}>
                {description}
              </span>
            </div>
            <div className={styles['card-content__icons']}>
              {overview && (
                <TbWorld
                  className={styles['icon-size']}
                  title={PortfolioLabel.onlineVersionTitle}
                  onClick={openURL(overview)}
                />
              )}

              {github && (
                <AiFillGithub
                  className={styles['icon-size']}
                  title={PortfolioLabel.githubRepoTitle}
                  onClick={openURL(github)}
                />
              )}

              <AiFillStar
                className={`${styles['icon-size']} ${
                  isRated ? styles['rated-star'] : ''
                }`}
                title={
                  isRated
                    ? PortfolioLabel.unStarProjectTitle
                    : PortfolioLabel.rateProjectTitle
                }
                onClick={rateProject}
              />
            </div>
          </>
        )}

        {(activeRatingHash || activeUnRatingHash) && (
          <LoadingComponent
            title={
              activeRatingHash
                ? PortfolioCardLabel.rating
                : PortfolioCardLabel.unRating
            }
          />
        )}
      </div>
      <ModalComponent
        show={claimTokensModal}
        setShow={setClaimTokensModal}
        acceptLabel={PortfolioLabel.freeTokensBtn}
        acceptBtnAction={claimAcceptBtnAction}
      >
        {PortfolioLabel.modalClaimDesc(tokenSymbol)}
      </ModalComponent>
      <ModalComponent
        show={stakeTokensModal}
        setShow={setStakeTokensModal}
        acceptLabel={PortfolioLabel.stakeTokensBtn}
        acceptBtnAction={stakeAcceptBtnAction}
      >
        {PortfolioLabel.modalStakeDesc(tokenSymbol)}
      </ModalComponent>
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

export default PortfolioCard;
