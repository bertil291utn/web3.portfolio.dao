import { Attributes } from '@interfaces/TokenProvider'

export interface Metadata {
  name: string
  description: string
  image: string
  price: number,
  attributes: Attributes[]
}
export interface TokenProfile extends Metadata {
  tokenId: number
  quantity: number
}

