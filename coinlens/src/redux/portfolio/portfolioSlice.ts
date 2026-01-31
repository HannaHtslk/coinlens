import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PortfolioItem = {
  coinId: string;
  name: string;
  amount: number;
  investedUsd: number;
};

type PortfolioState = {
  items: PortfolioItem[];
};

const initialState: PortfolioState = {
  items: [],
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addToPortfolio(state, action: PayloadAction<PortfolioItem>) {
      const existing = state.items.find(
        (item) => item.coinId === action.payload.coinId
      );

      if (existing) {
        existing.amount += action.payload.amount;
        existing.investedUsd += action.payload.investedUsd;
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromPortfolio(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.coinId !== action.payload
      );
    },
  },
});

export const { addToPortfolio, removeFromPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
