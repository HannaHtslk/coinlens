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
    getTopCoins: builder.query<CoinMarket[], number>({
      query: (page: number = 1) =>
        `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}`,
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
