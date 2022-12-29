import TokenProvider from '@context/TokenProvider';
import TokensComponent from '@layouts/Tokens.component';


export default function Home() {
  return (
    <TokenProvider>
      <TokensComponent/>
    </TokenProvider>
  )
}


