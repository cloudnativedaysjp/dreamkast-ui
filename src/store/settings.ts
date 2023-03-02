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
import { useSelector } from 'react-redux'

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
  talks: Talk[]

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
  talks: [],
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
      if (!action.payload) {
        return
      }
      const selectedTalk = state.talks.find((t) => t.id === action.payload)
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
      state.talks = action.payload
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

export const settingsSelector = (s: RootState) => s.settings

const appDataSelector = createSelector(settingsSelector, (s) => s.appData)
const _tracksSelector = createSelector(settingsSelector, (s) => s.tracks)
const _talksSelector = createSelector(settingsSelector, (s) => s.talks)
const viewTalkIdSelector = createSelector(settingsSelector, (s) => s.viewTalkId)
const viewTrackIdSelector = createSelector(
  settingsSelector,
  (s) => s.viewTrackId,
)

export const settingsInitializedSelector = createSelector(
  settingsSelector,
  (s) => {
    return !!(s.profile.id && s.eventAbbr)
  },
)

export const useStamps = () => {
  const appData = useSelector(appDataSelector)
  return {
    canGetNewStamp: !!appData.stampChallenges.find((i) => i.waiting),
    slotIdToBeStamped: appData.stampChallenges.find((i) => i.waiting)?.slotId,
    stamps: appData.stampChallenges.filter((i) => i.condition === 'stamped'),
  }
}

export const useTracks = () => {
  const tracks = useSelector(_tracksSelector)
  const talks = useSelector(_talksSelector)
  const tracksWithLiveTalk = tracks.map((tr) => {
    if (!tr.onAirTalk) {
      return {
        track: tr,
      }
    }
    const talkId = (tr.onAirTalk as { talk_id: string }).talk_id
    return {
      track: tr,
      talk: talks.find((t) => t.id === parseInt(talkId)),
    }
  })
  return { tracksWithLiveTalk }
}

export const useSelectedTrack = (): {
  track?: Track
  talks: Talk[]
  onAirTalk?: Talk
} => {
  const tracks = useSelector(_tracksSelector)
  const talks = useSelector(_talksSelector)
  const viewTrackId = useSelector(viewTrackIdSelector)
  if (tracks.length === 0) {
    return {
      talks: [],
    }
  }
  const selectedTrack =
    tracks.find((track) => track.id == viewTrackId) || tracks[0]
  const selectedTalks = talks.filter((t) => {
    return t.trackId === selectedTrack.id
  })
  const onAirTalk = selectedTalks.find((talk) => talk.onAir)
  return {
    track: selectedTrack,
    talks: selectedTalks,
    onAirTalk,
  }
}

export const useSelectedTalk = () => {
  const talks = useSelector(_talksSelector)
  const viewTrackId = useSelector(viewTrackIdSelector)
  const viewTalkId = useSelector(viewTalkIdSelector)

  const talksInTrack = talks.filter((t) => {
    return t.trackId === viewTrackId
  })
  if (talksInTrack.length === 0) {
    return {}
  }
  return {
    talk: talksInTrack.find((t) => t.id === viewTalkId) || talksInTrack[0],
  }
}

export default settingsSlice
