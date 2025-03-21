// slices/reservationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosInstance';
import { RootState } from '../store';

interface Reservation {
  _id: string;
  cleaner: any;
  client: any;
  date: string;
  duration: number;
  status: 'pending' | 'accepted' | 'rejected';
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

// Fetch cleaner availability
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
      
      return response.data;
    } catch (error: any) {
      console.error('Fetch availability error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
    }
  }
);

// Update reservation status (accept/reject)
export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async (
    { reservationId, status }: { reservationId: string; status: 'accepted' | 'rejected' },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
console.log('test resjecting',status);

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.patch(
        `/reservations/${reservationId}`,
        { status }, // Send status in request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed typo: "Authorisation" -> "Authorization"
          },
        }
      );

      return response.data; // Return updated reservation
    } catch (error: any) {
      console.error('Update reservation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update reservation status');
    }
  }
);

// Fetch cleaner reservations
export const fetchReservationsCleaner = createAsyncThunk(
  'reservations/fetchReservationsCleaner',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.get(`/reservations/cleaner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Fetch reservations error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cleaner reservations');
    }
  }
);
// Fetch client reservations
export const fetchReservationsClient = createAsyncThunk(
  'reservations/fetchReservationsClient',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.get(`/reservations/client `, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("clent reservation",response.data);
      

      return response.data;
    } catch (error: any) {
      console.error('Fetch reservations error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cleaner reservations');
    }
  }
);

// Create new reservation
export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (
    { cleanerId, date, duration, notes }: { cleanerId: string; date: string; duration: number; notes?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await apiClient.post(
        '/reservations',
        {
          cleanerId,
          date,
          duration,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Create reservation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create reservation');
    }
  }
);

// delete reservation
export const deleteReservation = createAsyncThunk("reservations/deleteReservation", 
  async (reservationsId: string, {getState, rejectWithValue})=>{
    try{
      const state = getState() as RootState
      const token = state.auth.token
      if (!token){
        return rejectWithValue('User is not authenticated')
      }
      const response = await apiClient.delete(`/reservations/${reservationsId}`)
      return response.data
    }catch(error: any){
      console.error('Delete reservation error:', error);}
  })

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Availability
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

      // Fetch Reservations Cleaner
      .addCase(fetchReservationsCleaner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationsCleaner.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservationsCleaner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Reservations Client
      .addCase(fetchReservationsClient.pending, (state) => {  
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationsClient.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservationsClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Reservation
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
      })

      // Update Reservation
      .addCase(updateReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReservation = action.payload;
        const index = state.reservations.findIndex((r) => r._id === updatedReservation._id);
        if (index !== -1) {
          state.reservations[index] = updatedReservation; // Update the reservation in state
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Reservation
      .addCase(deleteReservation.pending, (state) =>{
        state.loading = true;
        state.error = null
      })
      .addCase(deleteReservation.fulfilled, (state, action)=>{
        state.loading = false;
        const deletedReservation = action.payload
        const index = state.reservations.findIndex((r)=> r._id === deletedReservation._id)
        if (index !== -1){
          state.reservations.splice(index, 1)
        } 
      })
      .addCase(deleteReservation.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload as string
      });

  },
});

export default reservationsSlice.reducer;