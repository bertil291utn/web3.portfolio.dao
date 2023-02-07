import styles from './Input.module.scss';


interface Props {
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min: string
  max: string
  className: string
}

const InputComponent = ({
  type,
  name,
  value,
  onChange,
  min,
  max,
  className,
}: Props) => {
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
