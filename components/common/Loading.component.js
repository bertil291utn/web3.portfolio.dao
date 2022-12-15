import styles from './Loading.module.scss';

const LoadingComponent = ({ fullHeight, title, description }) => {
  return (
    <div
      className={`${styles['container']} ${
        fullHeight ? styles['full-height'] : ''
      }`}
    >
      <p className={styles['title']}>{title}</p>
      <span className={styles['subtitle']}>{description}</span>
    </div>
  );
};

export default LoadingComponent;
