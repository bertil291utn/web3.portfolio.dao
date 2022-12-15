import { BsBriefcase, BsFolder2Open, BsCoin, BsPerson } from 'react-icons/bs';
import { SiHashnode } from 'react-icons/si';

export const navbarElements = {
  portfolio: { label: 'portfolio', path: '/', icon: BsBriefcase },
  resume: { label: 'resume', path: '/resume', icon: BsFolder2Open },
  // tokens: { label: 'tokens', path: '/tokens', icon: BsCoin },
  // profile: { label: 'profile', path: '/profile', icon: BsPerson },
  blog: {
    label: 'blog',
    path: 'https://blog.bertiltandayamo.me/',
    icon: SiHashnode,
  },
};
