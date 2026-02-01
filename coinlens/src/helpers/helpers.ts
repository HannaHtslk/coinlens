export const getFallbackLetter = (value: string) =>
  value?.charAt(0).toUpperCase() ?? "?";

export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toString();
};

const STABLECOINS = new Set([
  "usdt",
  "usdc",
  "dai",
  "busd",
  "tusd",
  "usdp",
  "gusd",
  "frax",
]);

const FIAT = new Set(["usd", "eur", "gbp", "jpy", "cny"]);

export const isStableCoin = (symbol: string) =>
  STABLECOINS.has(symbol.toLowerCase());

export const isFiat = (symbol: string) => FIAT.has(symbol.toLowerCase());
