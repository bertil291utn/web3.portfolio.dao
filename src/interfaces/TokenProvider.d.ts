
interface Attributes {
  trait_rarity: string
  value: number
}

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


export interface TokenContext {
  NFTData: TokenElem[]
}