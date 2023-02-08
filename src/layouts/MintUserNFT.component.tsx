import InputComponent from '@components/common/Input.component';
import { useState } from 'react';
import styles from './MintUserNFT.module.scss'

const MintUserNFT = () => {
  const [NFTName, setNFTName] = useState<string>();
  const [NFTDescription, setNFTDescription] = useState<string>();
  return (
    <div className={styles['container']}>
      <div className={styles["nft-content"]}>
        <InputComponent
          className={styles['input-nft-name']}
          name='NFTName'
          placeholder='NFT name'
          value={NFTName || ''}
          onChange={(e) => setNFTName(e.target.value)}
        />
        <InputComponent
          className={styles['input-nft-description']}
          name='NFTDescription'
          placeholder='NFT description'
          value={NFTDescription || ''}
          onChange={(e) => setNFTDescription(e.target.value)}
        />
      </div>
    </div>);
}

export default MintUserNFT;