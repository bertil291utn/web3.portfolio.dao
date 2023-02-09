import styles from './Footer.module.scss';
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const FooterComponent = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>();

  const switchTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setCurrentTheme(resolvedTheme)
  }, [resolvedTheme])

  return (
    <div className={styles['footer']}>
      <button
        onClick={switchTheme}
        className={styles['switch-button']}
        title='Switch theme'
      >
        {currentTheme === 'dark' ? <BsSunFill /> : <BsFillMoonFill />}
      </button>
      <span>{`All copyrights reserved, ${new Date().getFullYear()} Bertil Tandayamo`}</span>
    </div>
  );
};

export default FooterComponent;
