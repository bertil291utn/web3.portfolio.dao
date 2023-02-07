import styles from './Loading.module.scss';

interface Props {
  fullHeight?: boolean
  title: string
  description?: string
}

const LoadingComponent = ({ fullHeight, title, description }: Props) => {
  return (
    <div
      className={`${styles['container']} ${fullHeight ? styles['full-height'] : ''
        }`}
    >
      <p className={styles['title']}>{title}</p>
      <span className={styles['subtitle']}>{description}</span>
    </div>
  );
};

export default LoadingComponent;
