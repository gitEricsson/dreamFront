import { configureStore } from '@reduxjs/toolkit'
import { electionsReducer } from './slices/electionsSlice'
import { resultsReducer } from './slices/resultsSlice'
import { userReducer } from './slices/userSlice'
import { votesReducer } from './slices/votesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    elections: electionsReducer,
    results: resultsReducer,
    votes: votesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

