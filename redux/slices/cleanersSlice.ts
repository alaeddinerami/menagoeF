import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosInstance'; 
import { RootState } from '../store';

// Define the Cleaner type based on your backend response
interface Cleaner {
  _id: string;
  name: string;
  email: string;
  location: string;
  phone: string;
  image: string | null;
  roles: string[];
}

interface CleanersState {
  cleaners: Cleaner[];
  loading: boolean;
  error: string | null;
}

const initialState: CleanersState = {
  cleaners: [],
  loading: false,
  error: null,
};

export const fetchCleaners = createAsyncThunk(
  'cleaners/fetchCleaners',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;//
      const token = state.auth.token
    //   console.log('token',token);
      

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cleaners');
    }
  }
);

const cleanersSlice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCleaners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCleaners.fulfilled, (state, action) => {
        state.loading = false;
        state.cleaners = action.payload;
      })
      .addCase(fetchCleaners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cleanersSlice.reducer;