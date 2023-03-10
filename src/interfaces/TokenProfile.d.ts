
interface Link {
  opensea: string,
  metadata: string
}
export interface TokenProfile {
  tokenId: number
  name: string
  image: string
  links: Link
  superRare: boolean
  balance: number
}

