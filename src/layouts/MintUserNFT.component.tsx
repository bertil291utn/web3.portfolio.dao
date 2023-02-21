import ButtonComponent from '@components/common/Button.component';
import Chip from '@components/common/Chip.component';
import InputComponent from '@components/common/Input.component';
import LoadingComponent from '@components/common/Loading.component';
import SectionPanel from '@components/common/SectionPanel.component';
import Subtitle from '@components/common/Subtitle.component';
import TextArea from '@components/common/TextArea.component';
import ToastComponent from '@components/common/Toast.component';
import { Contract, signerOrProvider } from '@interfaces/provider';
import { generateLabels, mintLabels } from '@placeholders/home-mint.placeholders';
import { mintPrompts } from '@placeholders/mint-prompts-examples.placeholders';
import { capitalizeFirstWord, countNumberWords } from '@utils/common';
import { generateImage } from '@utils/HuggingFace.utils';
import { uploadImage } from '@utils/NFTStorageSDK.utils';
import { getNFT721Factory } from '@utils/web3';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { localStorageKeys } from '@keys/localStorage';
import { useRouter } from 'next/router';
import { navbarElements } from '@placeholders/navbar.placeholders';
import styles from './MintUserNFT.module.scss'

const GeneratedImage = dynamic(() => import('@components/GeneratedImage.component'),
  {
    loading: () => <LoadingComponent title='Generating image...' />,
    ssr: false,
  })

const MintUserNFT = () => {
  const [NFTName, setNFTName] = useState<string>('');
  const [NFTDescription, setNFTDescription] = useState<string>('');
  const [currentActiveWindow, setCurrentActiveWindow] = useState<number>(1);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('');
  const [dataBuffer, setDataBuffer] = useState<ArrayBuffer>(new ArrayBuffer(0));
  const [showToastModal, setShowToastModal] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageKey, setImageKey] = useState<number>(0);
  const [theresTokenURI, setTheresTokenURI] = useState<string>('');
  const [activeMintNFTHash, setActiveMintNFTHash] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const provider = useProvider();
  const { address } = useAccount();


  const isFinishedTransferTx = async ({ signerOrProvider, address }: Contract) => {
    const NFT721Contract = getNFT721Factory(signerOrProvider);
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    NFT721Contract.on('Transfer', async (from, to) => {
      if (
        from?.toLowerCase() == ethers.constants.AddressZero &&
        to?.toLowerCase() == address?.toLowerCase()
      ) {
        try {
          await finishTx();
        } catch (error: any) {
          setShowToastModal(error.reason?.replace('execution reverted:', ''))
        }
      }
    });
  };

  const _generateImage = async () => {

    try {
      const { contentType, dataBuffer } = await generateImage(NFTDescription);
      const base64data = Buffer.from(dataBuffer).toString("base64");
      contentType && setMimeType(contentType);
      dataBuffer && setDataBuffer(dataBuffer);
      return `data:${contentType};base64,` + base64data;

    } catch (error) {
      setShowToastModal((error as Error).message);
    }
    finally {
      setLoading(false);
      setImageKey((prev) => ++prev);
    }

  }

  const sendPrompt = async () => {
    setGeneratedImage('')
    if (!NFTDescription) return;
    if (countNumberWords(NFTDescription) < 5) {
      setShowToastModal('Enter at least 5 words');
      return;
    }
    setLoading(true);
    const _image = await _generateImage();
    _image && setGeneratedImage(_image);

  }

  useEffect(() => { !NFTDescription && setGeneratedImage('') }, [NFTDescription]);

  useEffect(() => {
    signer && theresTokenURI && _mintNFT(theresTokenURI, signer);
  }, [theresTokenURI])

  useEffect(() => {
    setActiveMintNFTHash(
      !!window.localStorage.getItem(localStorageKeys.claimingTxHash)
    );
  }, []);

  useEffect(() => {
    address && isFinishedTransferTx({ signerOrProvider: provider, address });
  }, [address]);

  const _mintNFT = async (tokenUri: string, signer: signerOrProvider) => {
    try {
      const NFT721Contract = getNFT721Factory(signer);
      let tx = await NFT721Contract.safeMint(tokenUri, { value: ethers.utils.parseEther('0.27') });
      window.localStorage.setItem(localStorageKeys.mintNFTTokenTxHash, tx.hash);
      setActiveMintNFTHash(tx.hash);
      await tx.wait();
    } catch (error: any) {
      setShowToastModal(error.reason?.replace('execution reverted:', ''))
    }
  }

  const mintNFT = async () => {


    if (!NFTName) {
      setShowToastModal('Add an image title');
      return
    }

    if (countNumberWords(NFTName) < 2) {
      setShowToastModal('Add at least 2 meaningful words');
      return;
    }

    if (!signer) {
      openConnectModal && await openConnectModal();

    }

    const tokenuri = await uploadImage({
      imageData: dataBuffer,
      imageName: `${NFTName.trim().replace(/\s+/g, '-')}.${mimeType.split('/').pop()}`,
      mimeType,
      name: capitalizeFirstWord(NFTName.trim()),
      description: capitalizeFirstWord(NFTDescription),
      attributes: [
        {
          trait_type: "Name",
          value: NFTName
        },
        {
          trait_type: "Rarity",
          value: Math.floor(Math.random() * 96) + 5
        }
      ]
    })

    tokenuri && setTheresTokenURI(tokenuri)

  }

  const setCloseCurrentTx = () => {
    window.localStorage.removeItem(localStorageKeys.mintNFTTokenTxHash);
  };

  const finishTx = async () => {
    setCloseCurrentTx();
    setActiveMintNFTHash(false);
    router.push(navbarElements.profile.path);
    await new Promise((r) => setTimeout(r, 2000));
    window.location.reload();
  };

  return (
    <div className={styles['container']}>

      {currentActiveWindow === 1 && <div className={styles["nft-content"]}>
        <SectionPanel
          id={generateLabels.id}
          title={generateLabels.title}
          subtitle={generateLabels.subtitle}
        >
          {loading ? (
            <LoadingComponent title='Generating image...' />
          ) : generatedImage &&
          <div className={styles['image-nft-container']}>
            <Fragment key={imageKey}>
              <GeneratedImage src={generatedImage}
                className={`${styles['image-nft']}`}
              />
            </Fragment>
            <ButtonComponent className={styles['mint-button']} onClick={() => setCurrentActiveWindow((prev) => ++prev)}>
              go to mint
            </ButtonComponent>
          </div>
          }


          <div className={styles["text-area-container"]}>

            <TextArea
              className={styles['input-description']}
              name='NFTDescription'
              placeholder='An Impressionist oil painting of sunflowers in a purple vase...'
              value={NFTDescription}
              onChange={(e) => setNFTDescription(e.target.value)}
              onSubmit={sendPrompt}
              buttonTitle='Render image'
              icon
            />
            <p className={styles['info-text']}>
              Be as specific as you can and add plenty of clear details. Do not hold back on those details.
            </p>
          </div>



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

            {!activeMintNFTHash ? <>
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

              <div className={styles['image-nft-container']}>
                <GeneratedImage src={generatedImage}
                  className={`${styles['image-nft']}`}
                />
                <ButtonComponent className={styles['mint-button']} onClick={mintNFT}>
                  mint
                </ButtonComponent>
              </div>
            </> : <>
              <LoadingComponent
                title={`Minting...`}
              />
            </>}
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