import { configureStore } from "@reduxjs/toolkit";
import { cryptoApi } from "../api/cryptoApi";
import portfolioReducer from "../redux/portfolio/portfolioSlice";
import { persistReducer } from "redux-persist";
import { portfolioPersistConfig } from "../redux/portfolio/persistConfig";
import favoritesReducer from "../redux/favorites/favoritesSlice";
import { favoritesPersistConfig } from "../redux/favorites/persistConfig";

const persistedPortfolioReducer = persistReducer(
  portfolioPersistConfig,
  portfolioReducer
);

const persistedFavoritesReducer = persistReducer(
  favoritesPersistConfig,
  favoritesReducer
);

export const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    portfolio: persistedPortfolioReducer,
    favorites: persistedFavoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(cryptoApi.middleware),
});

import { persistStore } from "redux-persist";
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
