import { User } from '@auth0/auth0-react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './index'

type AuthState = {
  user: User | null
  token: string
  roles: string[]

  // TODO move to appropriate redux store
  apiBaseUrl: string
  wsBaseUrl: string
  dkUrl: string
}

const initialState: AuthState = {
  user: null,
  token: '',
  roles: [],
  apiBaseUrl: '',
  wsBaseUrl: '',
  dkUrl: '',
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
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload
    },
    setApiBaseUrl: (state, action: PayloadAction<string>) => {
      state.apiBaseUrl = action.payload
    },
    setWsBaseUrl: (state, action: PayloadAction<string>) => {
      state.wsBaseUrl = action.payload.replace('http', 'ws')
    },
    setDkUrl: (state, action: PayloadAction<string>) => {
      state.dkUrl = action.payload
    },
  },
})

export const {
  setUser,
  setToken,
  setRoles,
  setApiBaseUrl,
  setWsBaseUrl,
  setDkUrl,
} = authSlice.actions
export default authSlice

export const authSelector = (state: RootState) => state.auth
