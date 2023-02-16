export const countNumberLetters = (prompt: string): number => {
  if (!prompt) return 0;

  const regex = /\S/g;
  return prompt.split(regex).length - 1;
}

export const countNumberWords = (prompt: string): number => {
  if (!prompt) return 0;

  const regex = /\s/g;
  return prompt.trim().split(regex).length;
}
