export const countNumberLetters = (prompt: string): number => {
  if (!prompt) return 0;

  const regex = /\S/g;
  return prompt.split(regex).length - 1;
}
