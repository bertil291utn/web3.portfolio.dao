import { getNFTs } from '@utils/firebaseFunctions';
import { createContext, useContext, useEffect, useState } from 'react';

const TokenContext = createContext<any>(null);

export default function TokenProvider({ children }: any) {
  const [NFTData, setNFTData] = useState();

  const _getNFTs = async () => {
    let resp: any = await getNFTs();
    resp = resp.docs.map((doc: any) => doc.data())
    setNFTData(resp)
  }

  useEffect(() => {
    _getNFTs();

  }, [])

  return (
    <TokenContext.Provider
      value={{
        NFTData,
        setNFTData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useTokenContext = () => {
  return useContext(TokenContext);
};
