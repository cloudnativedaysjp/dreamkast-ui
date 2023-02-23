import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  DkUiData,
  Event,
  Profile,
  ProfilePointsResponse,
} from '../generated/dreamkast-api.generated'
import { RootState } from './index'
import { createSelector } from 'reselect'
import dayjs from 'dayjs'

type SettingsState = {
  eventAbbr: string
  event: Event | null
  conferenceDay: {
    id: string
    date: string | undefined
    internal: boolean | undefined
  } | null
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
  event: null,
  conferenceDay: null,
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
    setEvent: (state, action: PayloadAction<Event>) => {
      state.event = action.payload
      const today = dayjs(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DD')
      const confDay = action.payload?.conferenceDays?.find(
        (day) => day.date === today,
      )
      if (confDay) {
        state.conferenceDay = {
          id: String(confDay.id),
          date: confDay.date,
          internal: confDay.internal,
        }
      }
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
  setEvent,
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
