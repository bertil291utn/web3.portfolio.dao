import styles from './Title.module.scss';

interface Props {
  children: React.ReactNode
  className: string
}

const Title = ({ children, className }: Props) => {
  return (
    <span className={`${styles['title']} ${className || ''}`}>
      {children}
    </span>);
}

export default Title;