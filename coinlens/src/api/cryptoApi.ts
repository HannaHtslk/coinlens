import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type CoinMarket,
  type CoinDetails,
  type MarketChartResponse,
} from "../types/coin";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3/",
  }),
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    getTopCoins: builder.query<CoinMarket[], { page: number; perPage?: number }>({
      query: ({ page = 1, perPage = 20 }) =>
        `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}`,
      keepUnusedDataFor: 600,
    }),
    getCoinById: builder.query<CoinDetails, string>({
      query: (coinId) => `coins/${coinId}`,
    }),
    getCoinMarketChart: builder.query<
      MarketChartResponse,
      { coinId: string; days: number }
    >({
      query: ({ coinId, days }) =>
        `coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    }),
  }),
});

export const {
  useGetTopCoinsQuery,
  useGetCoinByIdQuery,
  useGetCoinMarketChartQuery,
} = cryptoApi;
