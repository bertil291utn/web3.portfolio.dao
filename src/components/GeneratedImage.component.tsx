import Image from 'next/image';
import styles from './GeneratedImage.module.scss';

interface Props {
  src: string
}

const GeneratedImage = ({ src }: Props) => {
  return (

    <div className={styles["image-content"]}>
      <Image
        src={src}
        layout='fill'
        objectFit='cover'
        objectPosition='center'
        alt={'nft-image'}
      />
    </div>
  );
}

export default GeneratedImage;