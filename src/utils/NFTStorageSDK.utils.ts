import { NFTSrorageApiKey } from '@config/api-keys';
import { Attributes } from '@interfaces/Image';
import { NFTStorage, File } from 'nft.storage';



interface uploadBody {
  name: string
  description: string
  image: File
  attributes: Array<Attributes>
}

interface IUploadImage {
  imageData: ArrayBuffer
  imageName: string
  mimeType: string
  name: string
  description: string
  attributes: Array<Attributes>
}


export const uploadImageFactory = async (body: uploadBody) => {
  if (!NFTSrorageApiKey || !body) return;
  const nftstorage = new NFTStorage({ token: NFTSrorageApiKey })

  const resp = await nftstorage.store(body)

  return resp.url

}

export const uploadImage = (uploadImage: IUploadImage) => {

  return uploadImageFactory({
    name: uploadImage.name,
    description: uploadImage.description,
    image: new File([uploadImage.imageData], uploadImage.imageName, { type: uploadImage.mimeType }),
    attributes: uploadImage.attributes
  })
}