import { ethers } from 'ethers'


export type signerOrProvider = ethers.Signer | ethers.providers.Provider

export interface Contract {
  address: string
  signerOrProvider:signerOrProvider
}


