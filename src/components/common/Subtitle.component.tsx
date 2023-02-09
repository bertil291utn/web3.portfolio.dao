import styles from './Subtitle.module.scss';

interface Props {
  children: React.ReactNode
  className?: string
}

const Subtitle = ({ children, className }: Props) => {
  return (
    <span className={`${styles['subtitle']} ${className || ''}`}>
      {children}
    </span>);
}

export default Subtitle;