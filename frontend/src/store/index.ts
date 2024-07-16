import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockData } from '../types';

interface StocksState {
  stocks: StockData[];
  symbol: string;
}

const initialStocks = localStorage.getItem('stocks');
const initialState: StocksState = {
  stocks: initialStocks ? JSON.parse(initialStocks) : [],
  symbol: 'BTC',
};

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setStocks(state, action: PayloadAction<StockData[]>) {
      state.stocks = action.payload;
      localStorage.setItem('stocks', JSON.stringify(action.payload));
    },
    setSymbol(state, action: PayloadAction<string>) {
      state.symbol = action.payload;
    },
  },
});

export const { setStocks, setSymbol } = stocksSlice.actions;

const store = configureStore({
  reducer: {
    stocks: stocksSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
