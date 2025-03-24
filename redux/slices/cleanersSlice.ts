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
  image?: string | null;
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
      // console.log('cleaners',response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cleaners');
    }
  }
);

export const createCleaner = createAsyncThunk<
  Cleaner,
  FormData,
  { state: RootState }
>(
  'cleaners/createCleaner',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;//
      const token = state.auth.token
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await apiClient.post('/user', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log(response.data);
      
      return response.data as Cleaner;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create cleaner'
      );
    }
  }
);
export const updateCleaner = createAsyncThunk<Cleaner,{id:string, formData:FormData}, { state: RootState }>(
  'cleaners/updateCleaner',
  async ({id, formData}, { getState, rejectWithValue }) => {
    try { 
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication required');
      }
      const formDataEntries: [string, any][] = [];
      formData.forEach((value, key) => {
        formDataEntries.push([key, value]);
      });
      console.log('Updating cleaner with ID:', id);
      console.log('FormData being sent:', formDataEntries);
      const response = await apiClient.patch(`/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
// console.log('cl',response.data);

      return response.data as Cleaner;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cleaner'
      );
    }
  })

  export const deleteCleaner =  createAsyncThunk(
    'cleaners/deleteCleaner', 
    async (id:string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        return rejectWithValue('Authentication required');
      } 
      const response =  await apiClient.delete(`/user/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
      return response.data;
    }catch(error:any){
      return rejectWithValue(error.response?.data?.message || 'Failed to delete cleaner');
    }
    });

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
      })
      //create cleaner
      .addCase(createCleaner.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createCleaner.fulfilled, (state, action)=>{
        state.loading = false;
        state.cleaners.push(action.payload);
      })
      .addCase(createCleaner.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })
      //update cleaner
      .addCase(updateCleaner.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCleaner.fulfilled, (state, action)=>{
        state.loading = false;
        const index = state.cleaners.findIndex((c)=>c._id === action.payload._id);
        if(index !== -1){
          state.cleaners[index] = action.payload;
          console.log('Updated cleaner in state:', state.cleaners[index]);
        }else{
          console.warn('Cleaner not found in state:', action.payload._id)
        }
      })
      .addCase(updateCleaner.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload as string;
      })
      //delete cleaner
      .addCase(deleteCleaner.pending , (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCleaner.fulfilled, (state, action)=>{
        state.loading= false;
         const deleteCleaner = action.payload;
        const index = state.cleaners.findIndex((c)=>c._id === deleteCleaner._id);
        if(index !== -1){
          state.cleaners.splice(index, 1)
        }
      })
      .addCase(deleteCleaner.rejected,(state, action)=>{
        state.loading = false;
        state.error = action.payload as string
      })
  },
});

export default cleanersSlice.reducer;