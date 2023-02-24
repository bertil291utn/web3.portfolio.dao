import { Attributes } from '@interfaces/Image'



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


export interface Context {
  NFTData: TokenElem[]
}