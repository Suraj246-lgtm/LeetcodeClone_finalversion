import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import streakReducer from '../slices/streakSlice';
import sheetReducer from '../slices/sheetSlice';
import contestReducer from '../slices/contestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    streak: streakReducer,
    sheet: sheetReducer,
    contest: contestReducer
  }
});

