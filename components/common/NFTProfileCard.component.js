import { IoDiamond } from 'react-icons/io5';
import styles from './NFTProfileCard.module.scss';

const NFTProfileCard = ({ tokenId, srcImage, name, superRare, className }) => {
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
