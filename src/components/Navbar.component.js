import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWalletContext } from '@context/WalletProvider';
import { ethers } from 'ethers';
import styles from './Navbar.module.scss';

// todo-wip: add blog with a scrapper or json file from medium hashnode and any other

const NavbarComponent = ({ navbarElements }) => {
  const router = useRouter();
  const { userCustomTokenBalance } = useWalletContext();

  return (
    <ul className={styles['navbar']}>
      {Object.values(navbarElements)?.map(
        ({ label, path, icon: Icon }, index) => {
          return (
            <li
              className={`${styles['list']} ${
                router.pathname == path ? `${styles['active']}` : ''
              }`}
              key={`navbar-${index}`}
            >
              <Link href={path}>
                <a
                  target={
                    label == navbarElements.blog.label ? '_blank' : undefined
                  }
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
          );
        }
      )}
    </ul>
  );
};

export default NavbarComponent;
