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

    updateAmount(
      state,
      action: PayloadAction<{ coinId: string; newAmount: number; currentPrice: number }>
    ) {
      const item = state.items.find((i) => i.coinId === action.payload.coinId);
      if (item) {
        const oldAmount = item.amount;
        const pricePerUnit = item.investedUsd / oldAmount;
        item.amount = action.payload.newAmount;
        item.investedUsd = pricePerUnit * action.payload.newAmount;
      }
    },
  },
});

export const { addToPortfolio, removeFromPortfolio, updateAmount } = portfolioSlice.actions;

export default portfolioSlice.reducer;
