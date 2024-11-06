import { configureStore } from '@reduxjs/toolkit';
import { accountSlice } from './account/accountSlice';
import sidebarReducer from './slices/sidebarSlice';

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    sidebar: sidebarReducer,
  },
});
