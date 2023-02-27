import { User } from '@auth0/auth0-react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  user: User | null
  token: string

  // TODO move to appropriate redux store
  apiBaseUrl: string
}

const initialState: AuthState = {
  user: null,
  token: '',
  apiBaseUrl: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setApiBaseUrl: (state, action: PayloadAction<string>) => {
      state.apiBaseUrl = action.payload
    },
  },
})

export const { setUser, setToken, setApiBaseUrl } = authSlice.actions
export default authSlice
