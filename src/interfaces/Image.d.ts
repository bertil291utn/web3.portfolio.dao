
export interface Attributes {
  trait_type: string
  value: string | number | boolean
  display_type?: string
}

export interface ImageUploadMetadata {
  tokenId?: number
  image: string
  image_ipfs?: string
  name: string
  description: string
  attributes: Attributes[]
}