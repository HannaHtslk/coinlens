import type { CoinMarket } from "../types/coin";

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

  return value.toFixed(2);
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

export const chartColors = [
  "#5B9BD5",
  "#70AD47",
  "#FFC000",
  "#9E7BB5",
  "#4BACC6",
  "#F79646",
  "#8E8E8E",
  "#C5504B",
];

export const isStableCoin = (symbol: string) =>
  STABLECOINS.has(symbol.toLowerCase());

export type MarketFilter = "all" | "favorites" | "crypto" | "stable";

export type SortKey = "price" | "marketCap" | "change24h" | "volume";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey | null;
  direction: SortDirection | null;
}


export const filterCoinsBySearch = (
  coins: CoinMarket[],
  search: string
): CoinMarket[] => {
  const searchTerm = search.toLowerCase().trim();
  if (!searchTerm) return coins;

  return coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm)
  );
};


export const filterCoinsByMarketType = (
  coins: CoinMarket[],
  marketFilter: MarketFilter,
  favoriteIds: string[]
): CoinMarket[] => {
  switch (marketFilter) {
    case "favorites":
      return coins.filter((coin) => favoriteIds.includes(coin.id));

    case "stable":
      return coins.filter((coin) => isStableCoin(coin.symbol));

    case "crypto":
      return coins.filter(
        (coin) => !isStableCoin(coin.symbol)
      );

    case "all":
    default:
      return coins;
  }
};


export const sortCoins = (
  coins: CoinMarket[],
  sortConfig: SortConfig
): CoinMarket[] => {
  if (!sortConfig.key || !sortConfig.direction) {
    return coins;
  }

  return [...coins].sort((a, b) => {
    let aValue = 0;
    let bValue = 0;

    switch (sortConfig.key) {
      case "price":
        aValue = a.current_price;
        bValue = b.current_price;
        break;

      case "marketCap":
        aValue = a.market_cap;
        bValue = b.market_cap;
        break;

      case "change24h":
        aValue = a.price_change_percentage_24h ?? 0;
        bValue = b.price_change_percentage_24h ?? 0;
        break;

      case "volume":
        aValue = a.total_volume;
        bValue = b.total_volume;
        break;
    }


    return sortConfig.direction === "desc" ? aValue - bValue : bValue - aValue;
  });
};


export const filterAndSortCoins = (
  coins: CoinMarket[],
  options: {
    search: string;
    marketFilter: MarketFilter;
    favoriteIds: string[];
    sortConfig: SortConfig;
  }
): CoinMarket[] => {
  let result = coins;

  result = filterCoinsBySearch(result, options.search);

  result = filterCoinsByMarketType(
    result,
    options.marketFilter,
    options.favoriteIds
  );

  result = sortCoins(result, options.sortConfig);

  return result;
};
