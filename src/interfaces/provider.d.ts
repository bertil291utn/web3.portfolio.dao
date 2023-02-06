import { ethers } from 'ethers'

export interface IProvider {
  signerProvider: ethers.providers.Provider | ethers.Signer
}

export interface Contract extends IProvider {
  address: string
}


