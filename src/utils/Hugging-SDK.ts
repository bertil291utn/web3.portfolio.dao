import { hugginFaceApiKey } from '@config/hugginface';

export const HuggingFaceSDK = (model: string, body: string) => {

  const URL = `https://api-inference.huggingface.co/models/${model}`;


  return fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hugginFaceApiKey}`
    },
    body,
  });


}