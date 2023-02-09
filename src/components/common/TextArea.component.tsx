import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './TextArea.module.scss';

interface Props {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit?: () => void
  id?: string
  className?: string
  placeholder?: string
  icon?: boolean
}

const TextArea = ({ className, name, id, placeholder, value, onChange, icon, onSubmit }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [themeClass, setThemeClass] = useState('');

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";

  };

  useEffect(() => {
    resizeTextArea();
  }, [value]);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setThemeClass(resolvedTheme === 'dark' ? styles['icon-container__dark'] : styles['icon-container__light']);
  }, [resolvedTheme])

  return (
    <div className={`${className || ''} ${styles['txa-content']}`}>
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Input textarea'}
        className={`${styles['text-area']}`}
        name={name}
        id={id}
      >
      </textarea>

      {icon && <button className={`${styles['icon-container']} ${themeClass}`} onClick={onSubmit}>
        <FiSend className={styles['icon']} />
      </button>}
    </div>
  );
}

export default TextArea;