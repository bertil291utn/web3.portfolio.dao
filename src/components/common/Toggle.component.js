import styles from './Toggle.module.scss';

const ToggleComponent = ({ available }) => {
  return (
    <label className={styles['switch']}>
      <input type='checkbox' checked={available} disabled />
      <span className={`${styles['slider']} ${styles['round']}`}></span>
    </label>
  );
};

export default ToggleComponent;
