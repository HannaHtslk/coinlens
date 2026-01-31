import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coingecko.com/api/v3/",
  }),
  endpoints: (builder) => ({
    getTopCoins: builder.query<any[], void>({
      query: () =>
        "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1",
    }),
    getCoinById: builder.query<any, string>({
      query: (coinId) => `coins/${coinId}`,
    }),
  }),
});

export const { useGetTopCoinsQuery, useGetCoinByIdQuery, } = cryptoApi;