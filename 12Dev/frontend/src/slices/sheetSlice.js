import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

export const fetchAllSheetsProgress = createAsyncThunk(
  'sheet/fetchAllProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/sheet/progress');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sheets progress');
    }
  }
);

export const fetchCompanySheet = createAsyncThunk(
  'sheet/fetchCompanySheet',
  async (company, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/sheet/${company}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company sheet');
    }
  }
);

export const fetchCompanyProgress = createAsyncThunk(
  'sheet/fetchCompanyProgress',
  async (company, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/sheet/${company}/progress`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company progress');
    }
  }
);

const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {
    allProgress: {}, // { google: { total: 10, solved: 2, percentage: 20 }, ... }
    currentSheet: [], // problems in the active sheet
    currentProgress: null, // details of progress for active company
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentSheet: (state) => {
      state.currentSheet = [];
      state.currentProgress = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // All progress
      .addCase(fetchAllSheetsProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSheetsProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.allProgress = action.payload;
      })
      .addCase(fetchAllSheetsProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Company sheet
      .addCase(fetchCompanySheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanySheet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSheet = action.payload;
      })
      .addCase(fetchCompanySheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Company progress
      .addCase(fetchCompanyProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCompanyProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(fetchCompanyProgress.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearCurrentSheet } = sheetSlice.actions;
export default sheetSlice.reducer;
