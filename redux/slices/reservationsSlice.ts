// slices/reservationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosInstance'; 
import { RootState } from '../store';

interface Reservation {
  _id: string;
  cleaner: string;
  client: string;
  date: string;
  duration: number;
  status: string;
  note?: string;
}

interface ReservationsState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  reservations: [],
  loading: false,
  error: null,
};

export const fetchAvailability = createAsyncThunk(
  'reservations/fetchAvailability',
  async (cleanerId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.get(`/reservations/${cleanerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response',response.data);
      
      return response.data;
    } catch (error: any) {
        console.error('error',error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async ({ cleanerId, date, duration, notes }: { cleanerId: string; date: string; duration: number; notes?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.post('/reservations', {
        cleanerId,
        date,
        duration,
        notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create reservation');
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reservationsSlice.reducer;