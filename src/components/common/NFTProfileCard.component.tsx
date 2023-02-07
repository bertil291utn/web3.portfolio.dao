import { IoDiamond } from 'react-icons/io5';
import styles from './NFTProfileCard.module.scss';

interface Props {
  tokenId: number
  quantity: number
  srcImage: string
  name: string
  superRare: boolean
  className?: string
}

const NFTProfileCard = ({ tokenId, quantity, srcImage, name, superRare, className }: Props) => {
  return (
    <div className={`${className || ''} ${styles['container']}`}>
      {superRare && (
        <div className={styles['chip']}>
          <section className={styles['diamond-rare']}>
            <IoDiamond />
          </section>
        </div>
      )}
      <img src={srcImage} alt={`${name}`} />
      <footer>
        <div className={styles['container']}>
          <div>
            <span className={styles['name']}>{name}</span>
            {quantity > 1 && <span className={styles['token-id']}>{`You own ${quantity} items`}</span>}
          </div>
          <div>
            <span className={styles['token-id']}>{`#${tokenId}`}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NFTProfileCard;
