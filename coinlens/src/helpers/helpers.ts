export const getFallbackLetter = (value: string) =>
  value?.charAt(0).toUpperCase() ?? "?";
