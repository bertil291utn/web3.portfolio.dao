import Head from 'next/head';
const author = 'Bertil Tandayamo';

const HeadComponent = ({
  canonicalURL,
  author,
  manifest,
  metaTitle,
  metaImage,
  description,
  keywords,
  title,
  favIcon,
  twitterUsername,
  themeColor,
}) => {
  return (
    <Head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <link rel='canonical' href={canonicalURL} />
      <meta name='author' content={author} />
      <link rel='manifest' href={manifest} />
      <link
        href='https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900;1000&display=optional'
        rel='stylesheet'
      />
      <meta name='theme-color' content={themeColor} />
      <meta name='title' content={metaTitle} />
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* twitter  */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content={twitterUsername} />
      <meta name='twitter:creator' content={twitterUsername} />
      <meta name='twitter:title' content={metaTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={metaImage} />

      {/* facebook  */}
      <meta property='og:locate' content='en_US' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={metaTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalURL} />
      <meta property='og:site_name' content={canonicalURL} />
      <meta property='og:image' content={metaImage} />

      <link rel='icon' type='image/svg+xml' href={favIcon} />
      <title>{title}</title>
    </Head>
  );
};

HeadComponent.defaultProps = {
  canonicalURL: 'https://www.bertiltandayamo.me',
  author,
  manifest: '/assets/manifest.json',
  metaTitle: 'Web3 Developer',
  metaImage: '/assets/images/og_imageok.png',
  description: 'Tech nerdy, music enthusiast conquering the world',
  keywords:
    'bertil, bertil alberto tandayamo lanchimba, bertil alberto tandayamo, Bertil, BERTIL, TANDAYAMO, Tandayamo, tandayamo, Bertil Tandayamo, BERTIL TANDAYAMO,bertil tandayamo, Full Stack Developer Ecuador, Ecuador developer, cayambe developer, CAYAMBE desarrollador',
  title: author,
  favIcon: '/assets/icons/favicon.svg',
  twitterUsername: '@btandayamo',
  themeColor: '#fcded1',
};

export default HeadComponent;
