import { useEffect, useRef, useState } from 'react';
import styles from './TextArea.module.scss';

interface Props {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  id?: string
  className?: string
  placeholder?: string
}

const TextArea = ({ className, name, id, placeholder, value, onChange }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  useEffect(() => { value && resizeTextArea() }, [value]);


  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Input textarea'}
      className={`${className || ''} ${styles['text-area']}`}
      name={name}
      id={id}
    ></textarea>
  );
}

export default TextArea;