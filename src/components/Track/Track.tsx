import React, { useEffect, useState, useRef } from 'react'
import { IvsPlayer } from '../IvsPlayer'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { TalkSelector } from '../TalkSelector'
import { TalkInfo } from '../TalkInfo'
import { Sponsors } from '../Sponsors'
import ActionCable from 'actioncable'
import 'dayjs/locale/ja'
import {
  Event,
  Talk,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
} from '../../generated/dreamkast-api.generated'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectedTalkSelector,
  selectedTrackSelector,
  settingsSelector,
  setViewTalkId,
} from '../../store/settings'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { getSlotId } from '../../util/sessionstorage/trailMap'
import { authSelector } from '../../store/auth'

type Props = {
  event: Event
  propTalks?: Talk[]

  refetch: () => void
}

export const TrackView: React.FC<Props> = ({ event, refetch }) => {
  const {
    track: selectedTrack,
    talks,
    onAirTalk,
  } = useSelector(selectedTrackSelector)
  const dispatch = useDispatch()
  const { talk: selectedTalk } = useSelector(selectedTalkSelector)

  const [videoId, setVideoId] = useState<string | null>()
  const [karteTimer, setKarteTimer] = useState<number>()
  const [pointTimer, setPointTimer] = useState<number>()
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true)
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const [nextTalk, setNextTalk] = useState<{ [trackId: number]: Talk }>()
  const beforeTrackId = useRef<number | undefined>(selectedTrack?.id)
  const settings = useSelector(settingsSelector)
  const { wsBaseUrl } = useSelector(authSelector)
  const theme = useTheme()
  const isSmallerThanMd = !useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    if (isLiveMode && talks.length > 0) {
      refetch()
    }
  }, [isLiveMode])

  const selectTalk = (talk: Talk) => {
    dispatch(setViewTalkId(talk.id))
    setVideoId(talk.onAir ? selectedTrack?.videoId : talk.videoId)
  }

  useEffect(() => {
    if (
      !talks.length ||
      shouldUpdate ||
      (!isLiveMode && beforeTrackId.current === selectedTrack?.id)
    )
      return
    beforeTrackId.current = selectedTrack?.id
    const nextTalk = onAirTalk ? onAirTalk : talks[0]
    dispatch(setViewTalkId(nextTalk.id))
    if (!onAirTalk) {
      // NOTE just for testing
      setVideoId(selectedTrack?.videoId)
    } else {
      setVideoId(onAirTalk ? selectedTrack?.videoId : talks[0].videoId)
    }
  }, [talks])

  const onChecked = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setIsLiveMode(checked)
  }

  const updateView = () => {
    setShouldUpdate(false)
    if (
      !nextTalk ||
      !selectedTrack ||
      !nextTalk[selectedTrack.id] ||
      !selectedTalk
    )
      return
    if (
      selectedTrack.id == nextTalk[selectedTrack.id].trackId &&
      selectedTalk.id != nextTalk[selectedTrack.id].id
    ) {
      window.location.href =
        window.location.href.split('#')[0] + '#' + selectedTalk.id // Karteの仕様でページ内リンクを更新しないと同一PV扱いになりアンケートが出ない
      window.tracker.track('trigger_survey', {
        track_name: selectedTrack?.name,
        talk_id: selectedTalk?.id,
        talk_name: selectedTalk?.title,
      })
      setVideoId(nextTalk[selectedTrack.id].videoId)
      dispatch(setViewTalkId(nextTalk[selectedTrack.id].id))
    }
  }

  useEffect(() => {
    if (shouldUpdate) {
      updateView()
    }
  }, [shouldUpdate])

  useEffect(() => {
    if (chatCable) chatCable.disconnect()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const actionCableUrl = new URL('/cable', wsBaseUrl).toString()
    const cable = actionCable.createConsumer(actionCableUrl)
    setChatCable(cable)
    cable.subscriptions.create(
      { channel: 'OnAirChannel', eventAbbr: event?.abbr },
      {
        received: (msg: { [trackId: number]: Talk }) => {
          refetch() // onAirの切り替わった新しいTalk一覧を取得
          setNextTalk(msg)
          if (!selectedTrack || !selectedTalk) return
          if (isLiveMode && msg[selectedTrack.id].id != selectedTalk.id)
            setShouldUpdate(true)
        },
      },
    )
  }, [selectedTrack, isLiveMode, selectedTalk])

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()

  useEffect(() => {
    if (!settings.initialized) {
      return
    }
    if (!selectedTrack || !selectedTalk) {
      return
    }
    clearInterval(karteTimer)
    setKarteTimer(
      window.setInterval(() => {
        window.tracker.track('watch_video', {
          track_name: selectedTrack.name,
          talk_id: selectedTalk.id,
          talk_name: selectedTalk.title,
        })
      }, 120 * 1000),
    )
    clearTimeout(pointTimer)
    if (!settings.profile.isAttendOffline && selectedTalk.onAir) {
      setPointTimer(
        window.setInterval(() => {
          const slotId = getSlotId(selectedTalk)
          if (slotId === 0) {
            return
          }
          mutateAppData({
            profileId: `${settings.profile.id}`,
            conference: settings.eventAbbr,
            dkUiDataMutation: {
              action: 'talkWatched',
              payload: {
                talkId: selectedTalk.id,
                trackId: selectedTrack?.id || 0,
                slotId: slotId,
              },
            },
          })
            .unwrap()
            .catch((err) => console.error(err))
        }, 120 * 1000),
      )
    }
  }, [selectedTrack, selectedTalk, settings.initialized])

  if (!settings.initialized) {
    // TODO show loading
    return <></>
  }

  if (settings.showVideo) {
    return (
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={8}>
          <IvsPlayer
            playBackUrl={videoId}
            autoplay={true}
            showStopVideoButton={
              isSmallerThanMd && settings.profile.isAttendOffline
            }
          ></IvsPlayer>
          <Sponsors event={event} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat event={event} talk={selectedTalk} />
        </Grid>
        <Grid item xs={12} md={8} style={{ height: '100%' }}>
          <TalkInfo
            event={event}
            selectedTalk={selectedTalk}
            selectedTrackName={selectedTrack?.name}
            selectedTrackId={selectedTrack?.id}
          />
        </Grid>
        <Grid item xs={12} md={4} style={{ height: '100%' }}>
          <TalkSelector
            selectedTalk={selectedTalk}
            selectedTrackId={selectedTrack?.id}
            talks={talks}
            isLiveMode={isLiveMode}
            changeLiveMode={onChecked}
            selectTalk={selectTalk}
            small
          />
        </Grid>
      </Grid>
    )
  } else {
    return (
      <Grid container spacing={1} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={4}>
          <TalkInfo
            event={event}
            selectedTalk={selectedTalk}
            selectedTrackName={selectedTrack?.name}
            selectedTrackId={selectedTrack?.id}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat event={event} talk={selectedTalk} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TalkSelector
            selectedTalk={selectedTalk}
            selectedTrackId={selectedTrack?.id}
            talks={talks}
            isLiveMode={isLiveMode}
            changeLiveMode={onChecked}
            selectTalk={selectTalk}
          />
        </Grid>
        <Grid item md={12}>
          <Sponsors event={event} />
        </Grid>
      </Grid>
    )
  }
}
