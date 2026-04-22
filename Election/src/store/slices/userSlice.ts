import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { RegisterUserInput, User } from '../../api/types';

type UserState = {
  current: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const STORAGE_KEY = 'election.currentUser';

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function storeUser(user: User | null) {
  try {
    if (!user) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

export const registerUser = createAsyncThunk<User, RegisterUserInput>(
  'user/register',
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.post<User>('/api/users', input);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Failed to register user';
      if (err.response?.status === 400) {
        const errorMsg = err.response.data?.error || err.response.data;
        message = errorMsg || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  },
);

export const fetchUserByEmail = createAsyncThunk<User, string>(
  'user/fetchByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.get<User>(
        `/api/users/email/${encodeURIComponent(email)}`,
      );
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let message = 'Failed to load user';
      if (err.response?.status === 400) {
        const errorMsg = err.response.data?.error || err.response.data;
        message = errorMsg || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  },
);

const initialState: UserState = {
  current: typeof window !== 'undefined' ? loadStoredUser() : null,
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.current = null;
      state.status = 'idle';
      state.error = null;
      storeUser(null);
    },
    setUser(state, action: PayloadAction<User>) {
      state.current = action.payload;
      state.status = 'succeeded';
      state.error = null;
      storeUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        storeUser(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to register';
      })
      .addCase(fetchUserByEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        storeUser(action.payload);
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load user';
      });
  },
});

export const { clearUser, setUser } = slice.actions;
export const userReducer = slice.reducer;
