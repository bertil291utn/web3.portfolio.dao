import { variantType } from '@interfaces/toast';
import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

interface Props {
  variant: variantType
  children: React.ReactNode
  show: boolean | string
  setShow: React.Dispatch<React.SetStateAction<boolean | string>>
}

const ToastComponent = ({ variant, children, show, setShow }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => clearTimeout(timer);

  }, [show])

  const handleClose = () => setShow(false);
  return (
    <div
      className={`${styles['toast']} ${styles[`toast__${variant}`]} ${show ? styles['toast__show'] : styles['toast__hide']
        }`}
    >
      <span className={`${styles['close']} hand`} onClick={handleClose}>
        X
      </span>

      <div className={`${styles[`toast__content`]}`}>{children}</div>
    </div>
  );
};

export default ToastComponent;
