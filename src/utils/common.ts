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

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function capitalizeFirstWord(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
