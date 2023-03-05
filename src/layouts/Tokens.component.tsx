import {
  tokenMainPage,
} from '@placeholders/tokens.placeholder';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ToastComponent from '@components/common/Toast.component';
import {
  getNFT1155Factory,
  getTokenFactory,
} from '@utils/web3';
import { useProvider } from 'wagmi';
import { signerOrProvider } from '@interfaces/provider'
import MintUserNFT from '@layouts/MintUserNFT.component';
import ClaimTokens from '@layouts/ClaimTokens';
import DAO from '@layouts/Dao.component';
import styles from './Token.module.scss';


const TokensComponent = () => {
  const [showToast, setShowToast] = useState<boolean | string>(false);
  const provider = useProvider();
  const { address, isConnected: _isConnected } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>();
  const [NFTBalance, setNFTBalance] = useState<number>();
  const [BatlERC20Tokens, setBatlERC20Tokens] = useState<number>();



  const _setNFTBalance = async (ownerAddress: string, provider: signerOrProvider) => {
    const NFT1155Contract = getNFT1155Factory(provider);
    let balance = await NFT1155Contract.balanceOfByOwner(ownerAddress);
    balance = Number(balance);
    setNFTBalance(balance)
  }

  const _setERC20Balance = async (ownerAddress: string, provider: signerOrProvider) => {
    const NFT20Contract = getTokenFactory(provider);
    let balance = await NFT20Contract.balanceOf(ownerAddress);
    balance = Number(balance);
    setBatlERC20Tokens(balance)
  }



  useEffect(() => {
    address && provider && _setNFTBalance(address, provider);
    address && provider && _setERC20Balance(address, provider);
    return () => {
      setNFTBalance(undefined);
      setBatlERC20Tokens(undefined);
    }
  }, [address, provider]);

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);


  return isConnected != undefined ? (
    <>
      {/* homepage layout */}
      {!isConnected && < div className={styles['connect-btn']}>
        <span className={styles['title']}>{tokenMainPage.title}</span>
        <p dangerouslySetInnerHTML={{
          __html: tokenMainPage.description,
        }} />
        <ConnectButton showBalance={false} />
      </div>}

      {/* connected wallet layouts */}
      {isConnected && <>
        {NFTBalance == 0 && <MintUserNFT />}
        {NFTBalance! > 0 &&
          <>
            {BatlERC20Tokens! > 0 && <DAO />}
            {BatlERC20Tokens == 0 &&
              <ClaimTokens
                setShowToast={setShowToast}
                isConnected={isConnected}
              />}
          </>}
      </>}


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
