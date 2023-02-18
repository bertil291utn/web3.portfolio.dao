import Image from 'next/image';
import styles from './GeneratedImage.module.scss';

interface Props {
  src: string
  className?: string
}

const GeneratedImage = ({ src, className}: Props) => {
  return (

    <div className={`${styles["image-content"]} ${className || ''} `} >
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