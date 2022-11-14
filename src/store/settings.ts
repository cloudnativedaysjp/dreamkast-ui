import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  DkUiData,
  Profile,
  ProfilePointsResponse,
} from '../generated/dreamkast-api.generated'
import { RootState } from './index'
import { createSelector } from 'reselect'

type SettingsState = {
  eventAbbr: string
  profile: Profile
  showVideo: boolean
  appData: DkUiData
  appDataInitialized: boolean
  pointData: ProfilePointsResponse
  pointDataInitialized: boolean
  isTrailMapOpen: boolean
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
  appDataInitialized: false,
  pointData: {
    total: 0,
    points: [],
  },
  pointDataInitialized: false,
  isTrailMapOpen: false,
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
      state.appDataInitialized = true
    },
    setPointData: (state, action: PayloadAction<ProfilePointsResponse>) => {
      state.pointData = action.payload
      state.pointDataInitialized = true
    },
    setTrailMapOpen: (state, action: PayloadAction<boolean>) => {
      state.isTrailMapOpen = action.payload
    },
  },
})

export const {
  setProfile,
  setShowVideo,
  setEventAbbr,
  setAppData,
  setPointData,
  setTrailMapOpen,
} = settingsSlice.actions

export const settingsSelector = (s: RootState) => {
  return {
    initialized: !!(s.settings.profile.id && s.settings.eventAbbr),
    ...s.settings,
  }
}
export const stampSelector = createSelector(settingsSelector, (s) => {
  return {
    initialized: s.appDataInitialized,
    canGetNewStamp: !!s.appData.stampChallenges.find((i) => i.waiting),
    slotIdToBeStamped: s.appData.stampChallenges.find((i) => i.waiting)?.slotId,
    stamps: s.appData.stampChallenges.filter((i) => i.condition === 'stamped'),
  }
})

export default settingsSlice
