import TokenProvider from '@context/TokenProvider';
import TokensComponent from '@layouts/Tokens.component';
import { nftDataURL } from '@config/URLs';


export default function Home({ nfts }: any) {
  return (
    <TokenProvider>
      <TokensComponent NFTData={nfts} />
    </TokenProvider>
  )
}

export async function getStaticProps() {
  const res = await fetch(nftDataURL);
  const nfts = await res.json();

  return {
    props: {
      nfts,
    },
  };
}
