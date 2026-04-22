import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { ElectionResults, Winner } from '../../api/types';

type ResultsState = {
  winnerByElectionId: Record<string, Winner | null | undefined>;
  detailsByElectionId: Record<string, ElectionResults | null | undefined>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ResultsState = {
  winnerByElectionId: {},
  detailsByElectionId: {},
  status: 'idle',
  error: null,
};

export const fetchWinner = createAsyncThunk<
  { electionId: string; winner: Winner },
  string
>('results/fetchWinner', async (electionId, { rejectWithValue }) => {
  try {
    const res = await api.get<Winner>(`/api/results/${electionId}/winner`);
    return { electionId, winner: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let message = 'Failed to load winner';
    if (err.response?.status === 400) {
      const errorMsg = err.response.data?.error || err.response.data;
      message = errorMsg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

export const fetchElectionResults = createAsyncThunk<
  { electionId: string; results: ElectionResults },
  string
>('results/fetchDetailed', async (electionId, { rejectWithValue }) => {
  try {
    const res = await api.get<ElectionResults>(`/api/results/${electionId}`);
    return { electionId, results: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let message = 'Failed to load election results';
    if (err.response?.status === 400) {
      const errorMsg = err.response.data?.error || err.response.data;
      message = errorMsg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

const slice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearResults(state, action: PayloadAction<string | undefined>) {
      const id = action.payload;
      if (typeof id === 'string') {
        delete state.winnerByElectionId[id];
        delete state.detailsByElectionId[id];
      } else {
        state.winnerByElectionId = {};
        state.detailsByElectionId = {};
      }
      state.status = 'idle';
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinner.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWinner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.winnerByElectionId[action.payload.electionId] =
          action.payload.winner;
      })
      .addCase(fetchWinner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load winner';
      })
      .addCase(fetchElectionResults.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchElectionResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detailsByElectionId[action.payload.electionId] =
          action.payload.results;
      })
      .addCase(fetchElectionResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load results';
      });
  },
});

export const { clearResults, clearError } = slice.actions;
export const resultsReducer = slice.reducer;
