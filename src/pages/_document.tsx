import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900;1000&display=optional'
          rel='stylesheet'
        />
        <meta name='theme-color' content={'#fcded1'} />
        <link rel='icon' type='image/svg+xml' href={'/favicon.svg'} />
        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
