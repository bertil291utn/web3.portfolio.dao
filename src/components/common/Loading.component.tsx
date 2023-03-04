import styles from './Loading.module.scss';

interface Props {
  fullHeight?: boolean
  title: string
  description?: string
  className?: string
}

const LoadingComponent = ({ fullHeight, title, description, className }: Props) => {
  return (
    <div
      className={`${className || ''} ${styles['container']} ${fullHeight ? styles['full-height'] : ''
        }`}
    >
      <p className={styles['title']}>{title}</p>
      <span className={styles['subtitle']}>{description}</span>
    </div>
  );
};

export default LoadingComponent;
