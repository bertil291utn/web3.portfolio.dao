import ButtonComponent from '@components/common/Button.component';
import Chip from '@components/common/Chip.component';
import InputComponent from '@components/common/Input.component';
import LoadingComponent from '@components/common/Loading.component';
import SectionPanel from '@components/common/SectionPanel.component';
import Subtitle from '@components/common/Subtitle.component';
import TextArea from '@components/common/TextArea.component';
import ToastComponent from '@components/common/Toast.component';
import { generateLabels, mintLabels } from '@placeholders/home-mint.placeholders';
import { mintPrompts } from '@placeholders/mint-prompts-examples.placeholders';
import { countNumberWords } from '@utils/common';
import { generateImage } from '@utils/HuggingFace.utils';
import { lazy, Suspense, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './MintUserNFT.module.scss'

const GeneratedImage = lazy(() => import('@components/GeneratedImage.component'))

const MintUserNFT = () => {
  const [NFTName, setNFTName] = useState<string>('');
  const [NFTDescription, setNFTDescription] = useState<string>('');
  const [currentActiveWindow, setCurrentActiveWindow] = useState<number>(1);
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [showToastModal, setShowToastModal] = useState<boolean | string>(false);

  const _generateImage = async () => {

    try {
      const { contentType, dataBuffer } = await generateImage(NFTDescription);
      const base64data = Buffer.from(dataBuffer).toString("base64");
      return `data:${contentType};base64,` + base64data;

    } catch (error) {
      setShowToastModal((error as Error).message);
    }

  }

  const sendPrompt = async () => {
    if (!NFTDescription) return;
    if (countNumberWords(NFTDescription) < 5) {
      setShowToastModal('Enter at least 5 words');
      return;
    }
    setGeneratedImage(await _generateImage());

  }


  return (
    <div className={styles['container']}>

      {currentActiveWindow === 1 && <div className={styles["nft-content"]}>
        <SectionPanel
          id={generateLabels.id}
          title={generateLabels.title}
          subtitle={generateLabels.subtitle}
        >


          {generatedImage &&
            <Suspense fallback={<LoadingComponent title='Generating image...' />}>
              {generatedImage && <GeneratedImage src={generatedImage} />}
            </Suspense>
          }


          <div className={styles["text-area-container"]}>

            <TextArea
              className={styles['input-description']}
              name='NFTDescription'
              placeholder='An Impressionist oil painting of sunflowers in a purple vase...'
              value={NFTDescription}
              onChange={(e) => setNFTDescription(e.target.value)}
              onSubmit={sendPrompt}
              icon
            />
            <p className={styles['info-text']}>
              Be as specific as you can and add plenty of clear details. Do not hold back on those details.
            </p>
          </div>

          {generatedImage && <ButtonComponent onClick={() => setCurrentActiveWindow((prev) => ++prev)}>
            mint
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
                    value={NFTName}
                    onChange={(e) => setNFTName(e.target.value)}
                  />
                </div>

                <GeneratedImage src={generatedImage} />
              </>
            }
          </SectionPanel>
        </>
      }

      <ToastComponent
        variant={`error`}
        show={showToastModal}
        setShow={setShowToastModal}

      >
        {showToastModal}
      </ToastComponent>


    </div >);
}

export default MintUserNFT;