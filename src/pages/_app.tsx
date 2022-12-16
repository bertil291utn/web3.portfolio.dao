
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import NavbarComponent from '@components/Navbar.component';
import FooterComponent from '@components/Footer.component';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { ThemeProvider } from 'next-themes';
import { chainProv, client } from '@utils/web3';
import WalletProvider from '@context/WalletProvider';
import '../css/global.scss';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chainProv}>
          <ThemeProvider>
            <NavbarComponent navbarElements={navbarElements} />
            <div className='content'>
              <Component {...pageProps} />
            </div>
            <FooterComponent />
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </WalletProvider>
  )
}
