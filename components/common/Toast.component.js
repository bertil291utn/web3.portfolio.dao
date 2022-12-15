import styles from './Toast.module.scss';

const ToastComponent = ({ variant, children, show, setShow }) => {
  const handleClose = () => setShow(false);
  return (
    <div
      className={`${styles['toast']} ${styles[`toast__${variant}`]} ${
        show ? styles['toast__show'] : styles['toast__hide']
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
