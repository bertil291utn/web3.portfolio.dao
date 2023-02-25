
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import FooterComponent from '@components/Footer.component';
import { navbarElements } from '@placeholders/navbar.placeholders';
import { ThemeProvider } from 'next-themes';
import { chainProv, client } from '@utils/web3';
import WalletProvider from '@context/WalletProvider';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import dynamic from 'next/dynamic';
import LoadingComponent from '@components/common/Loading.component';
import TokenProfileProvider from '@context/TokenProfileProvider';
import '../css/global.scss';

const NavbarComponent = dynamic(() => import('@components/Navbar.component'),
  {
    loading: () => <LoadingComponent title='Starting...' fullHeight />,
    ssr: false,
  })


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Web3 DAO</title>
      </Head>
      <WalletProvider>
        <TokenProfileProvider>
          {/* TODO:it might not be the right option add token profile warpping the entire app, think another way */}

          <WagmiConfig client={client}>
            <RainbowKitProvider chains={chainProv}>
              <ThemeProvider>
                <NavbarComponent />
                <div className='content'>
                  <Component {...pageProps} />
                </div>
                <FooterComponent />
              </ThemeProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </TokenProfileProvider>
      </WalletProvider>
    </>
  )
}
