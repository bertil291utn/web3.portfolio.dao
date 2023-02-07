import { IconType } from 'react-icons/lib';
import styles from './Button.module.scss';

interface Props {
  buttonType: string
  btnLabel: string
  onClick?: () => void
  LeftIcon?: IconType | undefined
  title?: string
  className?: string
  type?: "button" | "submit" | "reset" | undefined
}

const ButtonComponent = ({
  buttonType,
  btnLabel,
  onClick,
  LeftIcon,
  title,
  className,
  type,
}: Props) => {
  if (buttonType !== 'fab-button') {
    return (
      <button
        className={`${className ? className : ''} ${styles['button']} ${styles[buttonType]
          }`}
        onClick={onClick}
        title={title}
        type={type || 'button'}
      >
        {LeftIcon && <LeftIcon className={styles['left-icon']} />}
        <span>{btnLabel}</span>
      </button>
    );
  }
  if (buttonType === 'fab-button') {
    return (
      <button
        className={`${className ? className : ''} ${styles[buttonType]}`}
        onClick={onClick}
        title={title}
        type={type || 'button'}
      >
        {LeftIcon && <LeftIcon className={styles['left-icon']} />}
      </button>
    );
  }

  return (<></>)
};

export default ButtonComponent;
