import InputComponent from '@components/common/Input.component';
import TextArea from '@components/common/TextArea.component';
import { useState } from 'react';
import styles from './MintUserNFT.module.scss'

const MintUserNFT = () => {
  const [NFTName, setNFTName] = useState<string>();
  const [NFTDescription, setNFTDescription] = useState<string>();

  const sendPrompt = () => {
    if (NFTDescription && NFTDescription.length < 3) return;
    console.log('send prompt', NFTDescription)
  }
  return (
    <div className={styles['container']}>
      <div className={styles["nft-content"]}>
        {/* <InputComponent
          className={styles['input-nft-name']}
          name='NFTName'
          placeholder='Sunflowers painting'
          value={NFTName || ''}
          onChange={(e) => setNFTName(e.target.value)}
        /> */}

        <TextArea
          name='NFTDescription'
          placeholder='An Impressionist oil painting of sunflowers in a purple vase...'
          value={NFTDescription || ''}
          onChange={(e) => setNFTDescription(e.target.value)}
          onSubmit={sendPrompt}
          icon
        />
      </div>
    </div>);
}

export default MintUserNFT;