import { ethers } from 'ethers'

export interface Provider {
  signerProvider: ethers.providers.Provider | ethers.Signer
}

export interface Contract extends Provider {
  address: string
}


