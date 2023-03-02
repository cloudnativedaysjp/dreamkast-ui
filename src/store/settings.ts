import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  DkUiData,
  Event,
  Profile,
  ProfilePointsResponse,
  Talk,
  Track,
} from '../generated/dreamkast-api.generated'
import { RootState } from './index'
import { createSelector } from 'reselect'
import dayjs from 'dayjs'
import {
  getViewTrackIdFromSessionStorage,
  setViewTrackIdToSessionStorage,
} from '../util/sessionstorage/viewTrackId'

type SettingsState = {
  // カンファレンスイベント
  eventAbbr: string
  event: Event | null
  conferenceDay: {
    id: string
    date: string | undefined
    internal: boolean | undefined
  } | null

  // ユーザプロファイル
  profile: Profile

  // ビデオ表示・非表示（オフライン参加のみ有効）
  showVideo: boolean

  // トラックID
  viewTrackId: number

  // ポイントデータ
  appData: DkUiData
  appDataInitialized: boolean
  pointData: ProfilePointsResponse
  pointDataInitialized: boolean
  isTrailMapOpen: boolean

  // 全talk
  talks: Record<string, Talk>

  // 全track
  tracks: Track[]
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
  viewTrackId: 0,
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
  talks: {},
  tracks: [],
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    loadFromStorage: (state) => {
      state.viewTrackId = getViewTrackIdFromSessionStorage() || 0
    },
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
    setViewTrackId: (state, action: PayloadAction<number | null>) => {
      if (!action.payload) {
        return
      }
      const selectedTrack = state.tracks.find(({ id }) => id === action.payload)
      if (!selectedTrack) {
        return
      }
      state.viewTrackId = action.payload
      setViewTrackIdToSessionStorage(action.payload)
      window.location.href =
        window.location.href.split('#')[0] + '#' + selectedTrack.name
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
    setTalks: (state, action: PayloadAction<Talk[]>) => {
      state.talks = action.payload.reduce((accum, t) => {
        accum[t.id] = t
        return accum
      }, {} as Record<string, Talk>)
    },
    setTracks: (state, action: PayloadAction<Track[]>) => {
      state.tracks = action.payload
    },
  },
})

export const {
  loadFromStorage,
  setProfile,
  setShowVideo,
  setEventAbbr,
  setEvent,
  setAppData,
  setPointData,
  setTrailMapOpen,
  setTalks,
  setTracks,
  setViewTrackId,
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

export const tracksSelector = createSelector(settingsSelector, (s) => {
  const tracksWithLiveTalk = s.tracks.map((tr) => {
    if (!tr.onAirTalk) {
      return {
        track: tr,
      }
    }
    const talkId = (tr.onAirTalk as { talk_id: string }).talk_id
    return {
      track: tr,
      talk: s.talks[talkId],
    }
  })
  return { tracksWithLiveTalk }
})

export const selectedTrackSelector = createSelector(settingsSelector, (s) => {
  if (s.tracks.length === 0) {
    return null
  }
  const selected = s.tracks.find((track) => track.id == s.viewTrackId)
  return selected || s.tracks[0]
})

export default settingsSlice
