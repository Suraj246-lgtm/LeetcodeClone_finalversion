import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

export const fetchStreakStats = createAsyncThunk(
  'streak/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/streak/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch streak stats');
    }
  }
);

export const fetchHeatmapData = createAsyncThunk(
  'streak/fetchHeatmap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/streak/heatmap');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch heatmap data');
    }
  }
);

const streakSlice = createSlice({
  name: 'streak',
  initialState: {
    stats: {
      currentStreak: 0,
      longestStreak: 0,
      lastSolvedDate: null,
      totalSolved: 0
    },
    heatmap: [],
    loading: false,
    error: null
  },
  reducers: {
    resetStreakState: (state) => {
      state.stats = {
        currentStreak: 0,
        longestStreak: 0,
        lastSolvedDate: null,
        totalSolved: 0
      };
      state.heatmap = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchStreakStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStreakStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStreakStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch heatmap
      .addCase(fetchHeatmapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeatmapData.fulfilled, (state, action) => {
        state.loading = false;
        state.heatmap = action.payload;
      })
      .addCase(fetchHeatmapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetStreakState } = streakSlice.actions;
export default streakSlice.reducer;
