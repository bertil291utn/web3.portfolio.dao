import styles from './Input.module.scss';


interface Props {
  name: string
  value: string
  type?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: string
  max?: string
  placeholder?: string
  className?: string
}

const InputComponent = ({
  type,
  name,
  value,
  onChange,
  min,
  max,
  placeholder,
  className,
}: Props) => {
  return (
    <input
      placeholder={placeholder || 'Input'}
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
