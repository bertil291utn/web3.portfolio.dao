import { navbarElements } from '@placeholders/navbar.placeholders';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons/lib';
import { useAccount } from 'wagmi';
import styles from './Navbar.module.scss';


interface NavElements {
  label: string
  path: string
  visible: boolean
  icon: IconType
}



const NavbarComponent = () => {
  const router = useRouter();
  const [navbar, setNavbar] = useState<Array<NavElements>>(Object.values(navbarElements))
  const { isConnected } = useAccount();

  useEffect(() => {
isConnected && setNavbar(prevState =>
  prevState.map(navbarElement => {
    if (navbarElement.label === "profile") {
      return { ...navbarElement, visible: true };
    }
    return navbarElement;
  }))
  return()=>{

  }
  }, [isConnected])

  return (
    <ul className={styles['navbar']}>
      {navbar?.map(
        ({ label, path, visible, icon: Icon }, index) => {
          return visible ? (
            <li
              className={`${styles['list']} ${router.pathname == path ? `${styles['active']}` : ''
                }`}
              key={`navbar-${index}`}
            >
              <Link href={path}>
                <a
                  target={undefined}
                >
                  <span className={`${styles['navbar__content']}`}>
                    {label}
                  </span>
                  <span className={`${styles['navbar__icon']}`}>
                    <Icon />
                  </span>
                </a>
              </Link>
            </li>
          ) : null;
        }
      )}
    </ul>
  );
};

export default NavbarComponent;
