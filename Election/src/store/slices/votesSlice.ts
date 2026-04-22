import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { CastVoteInput } from '../../api/types';

type VotesState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastMessage: string | null;
};

const initialState: VotesState = {
  status: 'idle',
  error: null,
  lastMessage: null,
};

export const castVote = createAsyncThunk<string, CastVoteInput>(
  'votes/cast',
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.post<string>('/api/votes', input, {
        responseType: 'text',
        transformResponse: (r) => r,
      });
      return typeof res.data === 'string' ? res.data : 'Vote cast successfully';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Failed to cast vote';
      if (err.response?.status === 400 || err.response?.status === 403) {
        try {
          const data =
            typeof err.response.data === 'string'
              ? JSON.parse(err.response.data)
              : err.response.data;
          message = data?.error || message;
        } catch {
          message = err.response.data || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  },
);

const slice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    clearVoteStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.lastMessage = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(castVote.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(castVote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastMessage = action.payload;
      })
      .addCase(castVote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to cast vote';
      });
  },
});

export const { clearVoteStatus, clearError } = slice.actions;
export const votesReducer = slice.reducer;
