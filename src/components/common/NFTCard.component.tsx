import { cardLabel } from '@placeholders/nft-cards.placeholder';
import { IoDiamond } from 'react-icons/io5';
import styles from './NFTCard.module.scss';

interface Props {
  srcImage: string
  name: string
  price: string
  superRare: boolean
  className: string
  isFree: boolean
  onClick: () => void
  quantityLeft: string
  totalSupply: string
}

const NFTCard = ({
  srcImage,
  name,
  price,
  superRare,
  className,
  isFree,
  onClick,
  quantityLeft,
  totalSupply,
}: Props) => {
  return (
    <div className={`${className || ''} ${styles['container']}`}>
      {isFree && <span className={styles['chip']}>{cardLabel.free}</span>}
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
            <span className={styles['price']}>{price}</span>
          </div>
          <div>
            <span
              className={styles['quantity-tokens']}
            >{`${quantityLeft} of ${totalSupply}`}</span>
          </div>
        </div>
        <div className={styles['empty-button']}>&nbsp;</div>
        <div className={styles['button']} onClick={onClick}>
          {isFree ? cardLabel.claim : cardLabel.buyNow}
        </div>
      </footer>
    </div>
  );
};

export default NFTCard;
