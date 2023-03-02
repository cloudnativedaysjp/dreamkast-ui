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

  // 視聴track&talk
  viewTrackId: number
  viewTalkId: number
  isLiveMode: boolean

  // ポイントデータ
  appData: DkUiData
  appDataInitialized: boolean
  pointData: ProfilePointsResponse
  pointDataInitialized: boolean
  isTrailMapOpen: boolean

  // 全talk
  talks: Record<number, Talk>

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
  viewTalkId: 0,
  isLiveMode: true,
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
    setViewTalkId: (state, action: PayloadAction<number | null>) => {
      console.warn(action.payload)
      if (!action.payload) {
        return
      }
      const selectedTalk = state.talks[action.payload]
      console.warn(selectedTalk)
      if (!selectedTalk) {
        return
      }
      state.viewTalkId = action.payload
      if (!selectedTalk.onAir) {
        state.isLiveMode = false
      }
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
      }, {} as Record<number, Talk>)
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
  setViewTalkId,
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
      talk: s.talks[parseInt(talkId)],
    }
  })
  return { tracksWithLiveTalk }
})

export const selectedTrackSelector = createSelector(
  settingsSelector,
  (s): { track?: Track; talks: Talk[]; onAirTalk?: Talk } => {
    if (s.tracks.length === 0) {
      return {
        talks: [],
      }
    }
    const selectedTrack =
      s.tracks.find((track) => track.id == s.viewTrackId) || s.tracks[0]
    const selectedTalks = Object.values(s.talks).filter((t) => {
      return t.trackId === selectedTrack.id
    })
    const onAirTalk = selectedTalks.find((talk) => talk.onAir)
    return {
      track: selectedTrack,
      talks: selectedTalks,
      onAirTalk,
    }
  },
)

export const selectedTalkSelector = createSelector(
  settingsSelector,
  (s): { talk?: Talk } => {
    console.warn('selectedTalkSelector')
    const talks = Object.values(s.talks).filter((t) => {
      return t.trackId === s.viewTrackId
    })
    if (talks.length === 0) {
      return {}
    }
    console.warn(s.viewTalkId)
    const selectedTalk = talks.find((t) => t.id === s.viewTalkId)
    return {
      talk: selectedTalk || talks[0],
    }
  },
)

export default settingsSlice
