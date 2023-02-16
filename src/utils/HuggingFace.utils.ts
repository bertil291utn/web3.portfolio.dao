import { HuggingFaceSDK } from '@utils/Hugging-SDK'

export const analyzeText = async (text: string) => {
  const response = await HuggingFaceSDK('distilbert-base-uncased-finetuned-sst-2-english', JSON.stringify({ inputs: text }))
  return response.json();
}