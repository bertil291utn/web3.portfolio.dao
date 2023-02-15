import ButtonComponent from '@components/common/Button.component';
import Chip from '@components/common/Chip.component';
import InputComponent from '@components/common/Input.component';
import SectionPanel from '@components/common/SectionPanel.component';
import Subtitle from '@components/common/Subtitle.component';
import TextArea from '@components/common/TextArea.component';
import { generateLabels, mintLabels } from '@placeholders/home-mint.placeholders';
import { mintPrompts } from '@placeholders/mint-prompts-examples.placeholders';
import { countNumberLetters } from '@utils/common';
import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './MintUserNFT.module.scss'

const MintUserNFT = () => {
  const [NFTName, setNFTName] = useState<string>();
  const [NFTDescription, setNFTDescription] = useState<string>();
  const [currentActiveWindow, setCurrentActiveWindow] = useState<number>(1);
  const [generatedImage, setGeneratedImage] = useState<string>(
    // "https://preview.redd.it/an-avocado-armchair-v0-uooc9auz6qs81.png?auto=webp&s=bf5227eca8895def1f055e6407a6f5da5dbee3a7"
  );

  const sendPrompt = () => {
    if (countNumberLetters(NFTDescription || '') < 3) return;
    console.log('send prompt', NFTDescription)
  }


  return (
    <div className={styles['container']}>

      {currentActiveWindow === 1 && <div className={styles["nft-content"]}>

        <SectionPanel
          id={generateLabels.id}
          title={generateLabels.title}
          subtitle={generateLabels.subtitle}
        >

          {generatedImage && <div className={styles["image-content"]}>
            <Image
              src={generatedImage}
              layout='fill'
              objectFit='cover'
              alt={'nft-image'}
            />
          </div>}


          <div className={styles["text-area-container"]}>

            <TextArea
              className={styles['input-description']}
              name='NFTDescription'
              placeholder='An Impressionist oil painting of sunflowers in a purple vase...'
              value={NFTDescription || ''}
              onChange={(e) => setNFTDescription(e.target.value)}
              onSubmit={sendPrompt}
              icon
            />
            <p className={styles['info-text']}>
              Be as specific as you can and add plenty of clear details. Do not hold back on those details.
            </p>
          </div>

          {generatedImage && <ButtonComponent onClick={() => setCurrentActiveWindow((prev) => ++prev)}>
            go to mint
          </ButtonComponent>}

          <div className={styles["example-chips-container"]}>
            <Subtitle>
              Examples
            </Subtitle>
            <div className={styles["example-chips-content"]}>
              {mintPrompts.map((label, index) => (
                <div key={index}>
                  <Chip>{label}</Chip>
                </div>
              ))}
            </div>
          </div>
        </SectionPanel>



      </div>}

      {currentActiveWindow === 2 &&
        <>
          <AiOutlineArrowLeft className={styles['icon']} title='Go back' onClick={() => setCurrentActiveWindow((prev) => --prev)} />
          <SectionPanel
            id={mintLabels.id}
            title={mintLabels.title}
            subtitle={mintLabels.subtitle}
            className={styles['section-panel']}
          >

            {generatedImage &&
              <>
                <div
                  className={styles['input-nft-name']}
                >

                  <InputComponent
                    name='NFTName'
                    placeholder='Sunflowers painting'
                    value={NFTName || ''}
                    onChange={(e) => setNFTName(e.target.value)}
                  />
                </div>

                <div className={styles["image-content"]}>
                  <Image
                    src={generatedImage}
                    layout='fill'
                    objectFit='cover'
                    alt={'nft-image'}
                  />
                </div>
              </>
            }
          </SectionPanel>
        </>
      }

    </div >);
}

export default MintUserNFT;