import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { CreateElectionInput, Election } from '../../api/types';

type ElectionsState = {
  items: Election[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasFetched: boolean;
};

const initialState: ElectionsState = {
  items: [],
  status: 'idle',
  error: null,
  hasFetched: false,
};

export const fetchElections = createAsyncThunk<Election[]>(
  'elections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Election[]>('/api/elections');
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Failed to load elections';
      if (err.response?.status === 400 || err.response?.status === 403) {
        const errorMsg = err.response.data?.error || err.response.data;
        message = errorMsg || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  },
);

export const createElection = createAsyncThunk<Election, CreateElectionInput>(
  'elections/create',
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.post<Election>('/api/elections', input);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Failed to create election';
      if (err.response?.status === 400 || err.response?.status === 403) {
        const errorMsg = err.response.data?.error || err.response.data;
        message = errorMsg || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  },
);

export const startElection = createAsyncThunk<
  string,
  { id: string; userId: string }
>('elections/start', async ({ id, userId }, { rejectWithValue }) => {
  try {
    await api.patch(`/api/elections/${id}/start?userId=${userId}`);
    return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let message = 'Failed to start election';
    if (err.response?.status === 400 || err.response?.status === 403) {
      const errorMsg = err.response.data?.error || err.response.data;
      message = errorMsg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

export const endElection = createAsyncThunk<
  string,
  { id: string; userId: string }
>('elections/end', async ({ id, userId }, { rejectWithValue }) => {
  try {
    await api.patch(`/api/elections/${id}/end?userId=${userId}`);
    return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let message = 'Failed to end election';
    if (err.response?.status === 400 || err.response?.status === 403) {
      const errorMsg = err.response.data?.error || err.response.data;
      message = errorMsg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

export const deleteElection = createAsyncThunk<
  string,
  { id: string; userId: string }
>('elections/delete', async ({ id, userId }, { rejectWithValue }) => {
  try {
    await api.delete(`/api/elections/${id}?userId=${userId}`);
    return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let message = 'Failed to delete election';
    if (err.response?.status === 400 || err.response?.status === 403) {
      const errorMsg = err.response.data?.error || err.response.data;
      message = errorMsg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

const slice = createSlice({
  name: 'elections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchElections.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.hasFetched = true;
      })
      .addCase(fetchElections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchElections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load elections';
      })
      .addCase(createElection.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createElection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [action.payload, ...state.items];
      })
      .addCase(createElection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to create election';
      })
      .addCase(startElection.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startElection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        const item = state.items.find((e) => e.id === id);
        if (item) item.status = 'STARTED';
      })
      .addCase(startElection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to start election';
      })
      .addCase(endElection.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(endElection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        const item = state.items.find((e) => e.id === id);
        if (item) item.status = 'ENDED';
      })
      .addCase(endElection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to end election';
      })
      .addCase(deleteElection.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteElection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.items = state.items.filter((e) => e.id !== id);
      })
      .addCase(deleteElection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to delete election';
      });
  },
});

export const electionsReducer = slice.reducer;
