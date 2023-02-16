
export const HuggingFaceSDK = (model: string, body: string) => {

  const URL = `https://api-inference.huggingface.co/models/${model}`;


  return fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`
    },
    body,
  });


}