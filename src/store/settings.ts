import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DkUiData, Profile } from '../generated/dreamkast-api.generated'
import { RootState } from './index'
import { createSelector } from 'reselect'

type SettingsState = {
  eventAbbr: string
  profile: Profile
  showVideo: boolean
  appData: DkUiData
}

const initialState: SettingsState = {
  eventAbbr: '',
  profile: {
    id: 0,
    name: '',
    email: '',
    isAttendOffline: false,
  },
  showVideo: false,
  appData: {
    watchedTalksOnline: {
      watchingTime: [],
      prevTimestamp: 0,
    },
    stampChallenges: [],
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEventAbbr: (state, action: PayloadAction<string>) => {
      state.eventAbbr = action.payload
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
      state.showVideo = !action.payload.isAttendOffline
    },
    setShowVideo: (state, action: PayloadAction<boolean>) => {
      state.showVideo = action.payload
    },
    setAppData: (state, action: PayloadAction<DkUiData>) => {
      state.appData = action.payload
    },
  },
})

export const { setProfile, setShowVideo, setEventAbbr, setAppData } = settingsSlice.actions

export const settingsSelector = (state: RootState) => state.settings
export const isInitializedSelector = createSelector(settingsSelector, (s) => {
  return !!(s.profile.id && s.eventAbbr)
})

export default settingsSlice
