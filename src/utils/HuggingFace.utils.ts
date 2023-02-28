import { HuggingFaceSDK } from '@utils/Hugging-SDK'

export const analyzePrompt = async (text: string) => {
  const response = await HuggingFaceSDK('distilbert-base-uncased-finetuned-sst-2-english', JSON.stringify({ inputs: text }))
  return response.json();
}

export const generateImage = async (description: string) => {
  try {
    const response = await HuggingFaceSDK('stabilityai/stable-diffusion-2', JSON.stringify({
      inputs: description,
      options: { wait_for_model: true }
    }))
    const contentType = await response.headers.get('content-type');
    const dataBuffer = await response.arrayBuffer();
    return { contentType, dataBuffer }
  } catch (error: any) {
    console.error(error.message);
    throw new Error(`An error occurred while generating the image ${error.message}`);
  }
}