import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../generated/dreamkast-api.generated'
import { RootState } from './index'

type SettingsState = {
  isInitialized: boolean
  profile: Profile
  showVideo: boolean
}

const initialState: SettingsState = {
  isInitialized: false,
  profile: {
    id: 0,
    name: '',
    email: '',
    isAttendOffline: false,
  },
  showVideo: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
      state.showVideo = !action.payload.isAttendOffline
      state.isInitialized = true
    },
    setShowVideo: (state, action: PayloadAction<boolean>) => {
      state.showVideo = action.payload
    },
  },
})

export const { setProfile, setShowVideo } = settingsSlice.actions
export const settingsSelector = (state: RootState) => state.settings
export default settingsSlice
