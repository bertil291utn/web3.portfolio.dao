import styles from './Input.module.scss';

const InputComponent = ({
  type,
  name,
  value,
  onChange,
  min,
  max,
  className,
}) => {
  return (
    <input
      className={`${className || ''} ${styles['input']}`}
      type={type || 'text'}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
};

export default InputComponent;
