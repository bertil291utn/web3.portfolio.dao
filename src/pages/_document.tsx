import { Html, Head, Main, NextScript } from 'next/document'
//TODO-WIP: add fav icon and title
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900;1000&display=optional'
          rel='stylesheet'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
