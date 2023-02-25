import { Attributes } from '@interfaces/Image'
import { TokenProfile } from '@interfaces/TokenProfile'



export interface TokenElem {
  id: number
  image: string
  name: string
  description: string
  attributes: Attributes[]
  allMinted: boolean
  quantityLeft: string
  totalSupply: string
  price: string
  free: boolean
  superRare?: boolean
}


export interface ITokenContext {
  NFTData: TokenElem[],
  NFTBalance: number,
  NFTDataProfile: Array<TokenProfile>
}