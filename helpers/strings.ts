export const cleanText = (str: string) => str?.replace(/<[^>]*>?/gm, '')
