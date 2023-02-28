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
import { getNFT1155Factory } from '@utils/web3';
import { ethers } from 'ethers';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { localStorageKeys } from '@keys/localStorage';
import { useRouter } from 'next/router';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { pinIPFSImage } from '@utils/PinataSDK.utils';
import styles from './MintUserNFT.module.scss'
import GeneratedImage from '@components/GeneratedImage.component';


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
  const [tokenPrice, setTokenPrice] = useState<string>('');
  const [NFTQuantity, setNFTQuantity] = useState<string>('1');
  const { data: signer } = useSigner();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const provider = useProvider();
  const { address } = useAccount();


  const isFinishedTransferTx = async ({ signerOrProvider, address }: Contract) => {
    const NFT721Contract = getNFT1155Factory(signerOrProvider);
    //TODO: listen transfer event not just in token component, but also all over the app _app file
    NFT721Contract.on('TransferSingle', async (_, from, to) => {
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
      setGeneratedImage(`data:${contentType};base64,` + base64data);

    } catch (error) {
      setShowToastModal((error as Error).message);
    }
    finally {
      setLoading(false);
      setImageKey((prev) => ++prev);
    }

  }

  const _getTokenPrice = async (signerOrProvider: signerOrProvider) => {
    const NFT721Contract = getNFT1155Factory(signerOrProvider);
    const price = await NFT721Contract.getPriceToken()
    setTokenPrice(price)
  }

  const sendPrompt = async () => {
    setGeneratedImage('')
    if (!NFTDescription) return;
    if (countNumberWords(NFTDescription) < 5) {
      setShowToastModal('Enter at least 5 words');
      return;
    }
    setLoading(true);
    _generateImage();

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

  useEffect(() => {
    provider && _getTokenPrice(provider)
  }, [provider]);

  const _mintNFT = async (tokenUri: string, signer: signerOrProvider) => {
    try {
      const NFT721Contract = getNFT1155Factory(signer);
      let tx = await NFT721Contract.mint(
        Number(NFTQuantity),
        tokenUri,
        { value: ethers.utils.parseEther((0.27 * Number(NFTQuantity)).toString()) }
      );
      window.localStorage.setItem(localStorageKeys.mintNFTTokenTxHash, tx.hash);
      setActiveMintNFTHash(tx.hash);
      await tx.wait();
    } catch (error: any) {
      setShowToastModal(error.reason?.replace('execution reverted:', ''))
    } finally {
      setActiveMintNFTHash(false)
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
    if (Number(NFTQuantity) > 5) {
      setShowToastModal('Maximum amount to mint is 5');
      return;
    }

    if (!signer) {
      openConnectModal && await openConnectModal();
      return;
    }

    const metadata = JSON.stringify({
      name: capitalizeFirstWord(NFTName.trim()),
      description: capitalizeFirstWord(NFTDescription),
      attributes: [
        {
          trait_type: "Name",
          value: NFTName
        },
        {
          trait_type: "Rarity",
          value: (Math.floor(Math.random() * 96) + 5).toString()
        }
      ]
    })
    setActiveMintNFTHash(true);

    try {

      const tokenuri = await pinIPFSImage({
        imageName: `${NFTName.trim().replace(/\s+/g, '-')}`,
        imageMimeType: mimeType,
        arrayBufferImageData: dataBuffer,
        metadata
      });
      tokenuri && setTheresTokenURI(`ipfs://${tokenuri}`)
    } catch (error: any) {
      setShowToastModal(error.message)

    }


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

  const onChangeInputValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[1-5]$/;
    regex.test(ev.target.value) && setNFTQuantity(ev.target.value)
  }

  const ETHAmount = tokenPrice && (Number(ethers.utils.formatEther(tokenPrice)) * Number(NFTQuantity)).toFixed(Number(NFTQuantity) === 0 ? 1 : 3)

  return (
    <div className={styles['container']}>

      {currentActiveWindow === 1 && <div className={styles["nft-content"]}>
        <SectionPanel
          id={generateLabels.id}
          title={generateLabels.title}
          subtitle={generateLabels.subtitle}
        >
          {/* TODO: make more friendly aiting message 
           it'd be great to add gif or somethind while is loading the generative image.
          and after lest say 30 seconds the image doens t work just reload the page */}
          {loading ? (
            <LoadingComponent title='Generating image...' description='This could take few seconds. Just wait' />
          ) : generatedImage &&
          <div className={styles['image-nft-container']}>
            <GeneratedImage src={generatedImage}
              className={`${styles['image-nft']}`}
            />
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
                <div className={styles["action-container-button"]}>
                  <div className={styles["action-content"]}>
                    <InputComponent
                      name={`NFTQuantity`}
                      value={NFTQuantity}
                      onChange={onChangeInputValue}
                      type={`number`}
                      min='1'
                      max='5'
                      placeholder='Qty.'
                      className={styles['input']}
                    />
                    <ButtonComponent className={styles['mint-button-input']} onClick={mintNFT}>
                      {`mint for ${ETHAmount} ETH`}
                    </ButtonComponent>
                  </div>
                </div>
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