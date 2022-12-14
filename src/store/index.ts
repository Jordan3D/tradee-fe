import { configureStore } from '@reduxjs/toolkit'

import common from './common';
import trades from './trades';
import journalItem from './journalItem';
import transactions from './transactions';
// ...

export const store = configureStore({
  reducer: {
    common,
    trades,
    journalItem,
    transactions
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch