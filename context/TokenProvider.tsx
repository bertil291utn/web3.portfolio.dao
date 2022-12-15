import { createContext, useContext, useState } from 'react';

const TokenContext = createContext<any>(null);

export default function TokenProvider({ children }: any) {
  const [NFTData, setNFTData] = useState();

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
