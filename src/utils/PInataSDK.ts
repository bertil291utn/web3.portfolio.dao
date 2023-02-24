import { pinataApiKey, pinataApiKeySecret, pinataJWT } from '@config/api-keys';
import axios from 'axios';


interface ImageUpload {

  imageMimeType: string
  arrayBufferImageData: ArrayBuffer
  imageName: string
}

interface PinIPFSImage extends ImageUpload {
  metadata: string
}

interface MyFormData extends FormData {
  _boundary?: string;
  readableLength?: number
}



const IPFSMainURL = `https://api.pinata.cloud/pinning`


const IPFSFactory = (url: string, data: any, contentType: string) => {

  return axios
    .post(url, data, {
      headers: {
        'Content-Type': contentType,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiKeySecret,
      },
    })

}



export const pinImage = ({ imageName, imageMimeType, arrayBufferImageData }: ImageUpload) => {
  const imageBlob = new Blob([arrayBufferImageData!], { type: imageMimeType });

  const url = `${IPFSMainURL}/pinFileToIPFS`;
  const data: MyFormData = new FormData();
  data.append('file', imageBlob, `${imageName}.${imageMimeType.split('/').pop()}`);

  return IPFSFactory(url, data, `multipart/form-data; boundary=${data._boundary}`)

};


export const pinJSON = (metadata: string, metadataFileName: string, imageData: string) => {
  const url = `${IPFSMainURL}/pinJSONToIPFS`;
  const pinataMetadata = JSON.stringify({
    "pinataMetadata": {
      "name": `${metadataFileName}.json`,
    },
    "pinataContent": { ...JSON.parse(metadata), image: imageData }

  });


  return IPFSFactory(url, pinataMetadata, `application/json`)

}

export const pinIPFSImage = async ({ imageName, imageMimeType, arrayBufferImageData, metadata }: PinIPFSImage) => {
  const { data: imageData } = await pinImage({ imageName, imageMimeType, arrayBufferImageData });
  const { data } = await pinJSON(metadata, imageName, imageData.IpfsHash);
  return data.IpfsHash;

}