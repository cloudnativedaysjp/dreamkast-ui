import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Event,
  Profile,
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
import { setupDayjs } from '../util/setupDayjs'

setupDayjs()

type ConfDay = {
  id?: number | undefined
  date?: string | undefined
  internal?: boolean | undefined
}

export type OnAirTalk = {
  talk_id: number
  [k: string]: any
}

type SettingsState = {
  // カンファレンスイベント
  eventAbbr: string
  event: Event | null
  conferenceDay: {
    id: string
    date: string | undefined
    internal: boolean | undefined
  } | null

  // 全talk
  talks: Talk[]

  // 全track
  tracks: Track[]

  // ユーザプロファイル
  profile: Profile

  // ビデオ表示・非表示（オフライン参加のみ有効）
  showVideo: boolean

  // 視聴track&talk
  viewTrackId: number
  viewTalkId: number

  // 同じトラックのライブセッションに自動遷移するモード
  isLiveMode: boolean

  // 事前登録セッションに自動遷移するモード
  isAutoSwitchMode: boolean
}

const initialState: SettingsState = {
  eventAbbr: '',
  event: null,
  conferenceDay: null,
  talks: [],
  tracks: [],
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
  isAutoSwitchMode: false,
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
      const today = dayjs(new Date()).tz().format('YYYY-MM-DD')
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
    setConferenceDay: (state, action: PayloadAction<ConfDay>) => {
      const confDay = action.payload
      if (!confDay) {
        return
      }
      state.conferenceDay = {
        id: String(confDay.id),
        date: confDay.date,
        internal: confDay.internal,
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
    patchTalksOnAir: (
      s,
      action: PayloadAction<{ [trackId: number]: Talk }>,
    ) => {
      const nextTalks = action.payload

      s.tracks.forEach((t) => {
        const nextTalk = nextTalks[t.id]
        if (!nextTalk) {
          t.onAirTalk = null
          return
        }
        // Track.onAirTalk内のtalk_id以外の値は使っていない（openapiにも型定義がなく、極力依存すべきでない）
        // このため、talk_id以外は更新対象外とし、live talk一覧を描画するのに必要なtalk_idのみ更新する
        t.onAirTalk = {
          talk_id: nextTalk.id,
        } as OnAirTalk
      })

      s.talks.forEach((t) => {
        t.onAir = false

        const nextTalk = nextTalks[t.trackId]
        if (nextTalk?.id !== t.id) {
          return
        }
        if (nextTalk?.onAir) {
          t.onAir = nextTalk.onAir
        }
      })
    },
    updateViewTalkWithLiveOne: (
      s,
      action: PayloadAction<{ [trackId: number]: Talk }>,
    ) => {
      const nextTalks = action.payload
      if (!s.isLiveMode) {
        return
      }
      if (!s.viewTalkId || !s.viewTrackId) {
        return
      }
      const nextTalk = nextTalks[s.viewTrackId]
      if (!nextTalk) {
        // no live talk
        return
      }
      if (nextTalk.trackId !== s.viewTrackId) {
        console.warn('trackId mismatched: something wrong with backend')
        return
      }
      if (nextTalk.id === s.viewTalkId) {
        return
      }
      const selectedTrack = s.tracks.find((t) => t.id === s.viewTrackId)
      const selectedTalk = s.talks.find((t) => t.id === s.viewTalkId)
      if (!selectedTalk || !selectedTrack) {
        return
      }

      // Karte
      window.location.href =
        window.location.href.split('#')[0] + '#' + s.viewTalkId // Karteの仕様でページ内リンクを更新しないと同一PV扱いになりアンケートが出ない
      window.tracker?.track('trigger_survey', {
        track_name: selectedTrack?.name,
        talk_id: selectedTalk?.id,
        talk_name: selectedTalk?.title,
      })
      s.viewTalkId = nextTalk.id
    },
    setIsLiveMode: (state, action: PayloadAction<boolean>) => {
      state.isLiveMode = action.payload
    },
    setIsAutoSwitchMode: (state, action: PayloadAction<boolean>) => {
      state.isAutoSwitchMode = action.payload
    },
    setTalks: (state, action: PayloadAction<Talk[]>) => {
      if (action.payload.length === 0) {
        return
      }
      state.talks = action.payload
    },
    setTracks: (state, action: PayloadAction<Track[]>) => {
      if (action.payload.length === 0) {
        return
      }
      state.tracks = action.payload
    },
    setInitialViewTalk: (s) => {
      const selectedTrack = s.tracks.find((t) => t.id === s.viewTrackId)
      if (!selectedTrack) {
        s.viewTrackId = s.tracks[0].id
      }
      const selectedTalks = s.talks.filter((t) => t.trackId === s.viewTrackId)
      if (!selectedTalks.length) {
        return
      }
      const selectedTalk = selectedTalks.find((t) => t.id === s.viewTalkId)
      // 選択されているtalkが視聴トラックに存在する場合は、何もしない
      if (selectedTalk) {
        return
      }
      const onAirTalk = selectedTalks.find((talk) => talk.onAir)
      if (onAirTalk) {
        s.viewTalkId = onAirTalk.id
        s.isLiveMode = true
      } else {
        s.viewTalkId = selectedTalks[0].id
        s.isLiveMode = false
      }
    },
  },
})

export const {
  loadFromStorage,
  setProfile,
  setShowVideo,
  setEventAbbr,
  setEvent,
  setConferenceDay,
  setTalks,
  setTracks,
  setViewTrackId,
  setViewTalkId,
  setInitialViewTalk,
  setIsLiveMode,
  setIsAutoSwitchMode,
  patchTalksOnAir,
  updateViewTalkWithLiveOne,
} = settingsSlice.actions

export const settingsSelector = (s: RootState) => s.settings
export const profileSelector = createSelector(
  settingsSelector,
  (s) => s.profile,
)
export const tracksSelector = createSelector(settingsSelector, (s) => s.tracks)
export const talksSelector = createSelector(settingsSelector, (s) => s.talks)
export const viewTalkIdSelector = createSelector(
  settingsSelector,
  (s) => s.viewTalkId,
)
export const viewTrackIdSelector = createSelector(
  settingsSelector,
  (s) => s.viewTrackId,
)
export const showVideoSelector = createSelector(
  settingsSelector,
  (s) => s.showVideo,
)

export const isLiveModeSelector = createSelector(
  settingsSelector,
  (s) => s.isLiveMode,
)

export const isAutoSwitchModeSelector = createSelector(
  settingsSelector,
  (s) => s.isAutoSwitchMode,
)

export const settingsInitializedSelector = createSelector(
  settingsSelector,
  (s) => {
    return !!(s.profile.id && s.eventAbbr)
  },
)

export type VideoCommand = {
  status: 'preparing' | 'onAir' | 'archiving' | 'archived' | 'notSelected'
  playBackUrl?: string
}

export const newVideoCommand = (
  status: VideoCommand['status'],
  playBackUrl?: string,
) => ({ status, playBackUrl })

export const videoCommandSelector = createSelector(
  tracksSelector,
  talksSelector,
  viewTrackIdSelector,
  viewTalkIdSelector,
  (tracks, talks, viewTrackId, viewTalkId): VideoCommand => {
    if (tracks.length === 0) {
      return newVideoCommand('notSelected')
    }
    if (talks.length === 0) {
      return newVideoCommand('notSelected')
    }
    const selectedTrack = tracks.find((t) => t.id === viewTrackId)
    if (!selectedTrack) {
      return newVideoCommand('notSelected')
    }
    const selectedTalk = talks.find((t) => t.id === viewTalkId)
    if (!selectedTalk) {
      return newVideoCommand('notSelected')
    }
    if (selectedTalk.onAir) {
      if (!selectedTrack.videoId) {
        return newVideoCommand('preparing')
      }
      return newVideoCommand('onAir', selectedTrack.videoId)
    } else {
      if (!selectedTalk.videoId) {
        return newVideoCommand('archiving')
      }
      return newVideoCommand('archived', selectedTalk.videoId)
    }
  },
)

export type TrackWithTalk = {
  track: Track
  talk?: Talk
}

export const useTracks = () => {
  const tracks = useSelector(tracksSelector)
  const talks = useSelector(talksSelector)
  const tracksWithLiveTalk: TrackWithTalk[] = tracks.map((tr) => {
    const res = { track: tr } as TrackWithTalk
    if (!tr.onAirTalk) {
      return res
    }
    const talkId = (tr.onAirTalk as OnAirTalk).talk_id
    const talk = talks.find((t) => t.id === talkId)
    if (talk) {
      res.talk = talk
    }
    return res
  })
  return { tracksWithLiveTalk }
}

export const useSelectedTrack = (): {
  track?: Track
  talks: Talk[]
  onAirTalk?: Talk
} => {
  const tracks = useSelector(tracksSelector)
  const talks = useSelector(talksSelector)
  const viewTrackId = useSelector(viewTrackIdSelector)
  if (tracks.length === 0) {
    return {
      talks: [],
    }
  }
  const selectedTrack = tracks.find((track) => track.id == viewTrackId)
  if (!selectedTrack) {
    return {
      talks: [],
    }
  }
  const selectedTalks = talks.filter((t) => t.trackId === selectedTrack.id)
  const onAirTalk = selectedTalks.find((talk) => talk.onAir)
  return {
    track: selectedTrack,
    talks: selectedTalks,
    onAirTalk,
  }
}

export const useSelectedTalk = (): { talk?: Talk } => {
  const talks = useSelector(talksSelector)
  const viewTrackId = useSelector(viewTrackIdSelector)
  const viewTalkId = useSelector(viewTalkIdSelector)

  const talksInTrack = talks.filter((t) => {
    return t.trackId === viewTrackId
  })
  if (talksInTrack.length === 0) {
    return {}
  }
  const talk = talksInTrack.find((t) => t.id === viewTalkId)
  if (!talk) {
    return {}
  }
  return { talk }
}

export default settingsSlice
