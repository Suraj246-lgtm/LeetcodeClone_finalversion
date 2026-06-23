import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

export const fetchContests = createAsyncThunk(
  'contest/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/contest/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contests');
    }
  }
);

export const fetchContestDetails = createAsyncThunk(
  'contest/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/contest/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contest details');
    }
  }
);

export const fetchContestRegistration = createAsyncThunk(
  'contest/fetchRegistration',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/contest/${id}/registration`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contest registration');
    }
  }
);

export const registerForContest = createAsyncThunk(
  'contest/register',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/contest/${id}/register`);
      return response.data.registration;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register for contest');
    }
  }
);

export const startVirtualContest = createAsyncThunk(
  'contest/startVirtual',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/contest/${id}/virtual`);
      return response.data.registration;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start virtual contest');
    }
  }
);

export const fetchContestLeaderboard = createAsyncThunk(
  'contest/fetchLeaderboard',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/contest/${id}/leaderboard`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const contestSlice = createSlice({
  name: 'contest',
  initialState: {
    contestsList: [],
    activeContest: null,
    registration: null,
    leaderboard: [],
    loading: false,
    error: null
  },
  reducers: {
    clearActiveContest: (state) => {
      state.activeContest = null;
      state.registration = null;
      state.leaderboard = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contestsList = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch details
      .addCase(fetchContestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeContest = action.payload;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch registration
      .addCase(fetchContestRegistration.fulfilled, (state, action) => {
        state.registration = action.payload;
      })
      // Register
      .addCase(registerForContest.fulfilled, (state, action) => {
        state.registration = action.payload;
      })
      // Start Virtual
      .addCase(startVirtualContest.fulfilled, (state, action) => {
        state.registration = action.payload;
      })
      // Leaderboard
      .addCase(fetchContestLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  }
});

export const { clearActiveContest } = contestSlice.actions;
export default contestSlice.reducer;
