import styles from './Footer.module.scss';
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';

const FooterComponent = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const switchTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={styles['footer']}>
      <button
        onClick={switchTheme}
        className={styles['switch-button']}
        title='Switch theme'
      >
        {resolvedTheme === 'dark' ? <BsSunFill /> : <BsFillMoonFill />}
      </button>
      <span>{`All copyrights reserved, ${new Date().getFullYear()} Bertil Tandayamo`}</span>
    </div>
  );
};

export default FooterComponent;
