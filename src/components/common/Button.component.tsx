import { IconType } from 'react-icons/lib';
import styles from './Button.module.scss';

interface Props {
  children: React.ReactNode
  LeftIcon?: IconType | undefined
  onClick?: () => void
  title?: string
  className?: string
  buttonType?: string
  type?: "button" | "submit" | "reset"
}

const ButtonComponent = ({
  onClick,
  LeftIcon,
  title,
  className,
  children,
  type = 'button',
  buttonType = 'primary',
}: Props) => {
  if (buttonType !== 'fab-button') {
    return (
      <button
        className={`${className ? className : ''} ${styles['button']} ${styles[buttonType]
          }`}
        onClick={onClick}
        title={title}
        type={type}
      >
        {LeftIcon && <LeftIcon className={styles['left-icon']} />}
        <span>{children}</span>
      </button>
    );
  }
  if (buttonType === 'fab-button') {
    return (
      <button
        className={`${className ? className : ''} ${styles[buttonType]}`}
        onClick={onClick}
        title={title}
        type={type}
      >
        {LeftIcon && <LeftIcon className={styles['left-icon']} />}
      </button>
    );
  }

  return (<></>)
};

export default ButtonComponent;
