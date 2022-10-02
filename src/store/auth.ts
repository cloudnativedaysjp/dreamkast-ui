import { User } from '@auth0/auth0-react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  user: User | null
  token: string
}

const initialState: AuthState = {
  user: null,
  token: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { setToken } = authSlice.actions
export default authSlice
