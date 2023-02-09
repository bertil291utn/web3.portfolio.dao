import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './Chip.module.scss';

interface Props {
  children: React.ReactNode
}

const Chip = ({ children }: Props) => {
  const [themeClass, setThemeClass] = useState('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setThemeClass(resolvedTheme === 'dark' ? styles['container__dark'] : styles['container__light']);
  }, [resolvedTheme])
  return (
    <div className={`${styles['container']} ${themeClass}`}>
      <div className={styles['content']}>{children}</div>
    </div>
  );
}

export default Chip;