import React, { useEffect, useState } from 'react'
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
  useSelectedTalk,
  useSelectedTrack,
  settingsInitializedSelector,
  settingsSelector,
  setViewTalkId,
  settingsVideoIdSelector,
  isLiveModeSelector,
  setIsLiveMode,
  autoUpdateTalkInLive,
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
  const { track: selectedTrack, talks } = useSelectedTrack()
  const dispatch = useDispatch()
  const { talk: selectedTalk } = useSelectedTalk()
  const videoId = useSelector(settingsVideoIdSelector)

  const [karteTimer, setKarteTimer] = useState<number>()
  const [pointTimer, setPointTimer] = useState<number>()
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const { wsBaseUrl } = useSelector(authSelector)
  const theme = useTheme()
  const isSmallerThanMd = !useMediaQuery(theme.breakpoints.up('md'))

  const isLiveMode = useSelector(isLiveModeSelector)
  useEffect(() => {
    if (isLiveMode && talks.length > 0) {
      refetch()
    }
  }, [isLiveMode])

  const changeLiveMode = (checked: boolean) => {
    dispatch(setIsLiveMode(checked))
  }

  const selectTalk = (talk: Talk) => {
    dispatch(setViewTalkId(talk.id))
  }

  useEffect(() => {
    if (chatCable) chatCable.disconnect()
    chatCable?.ensureActiveConnection()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const actionCableUrl = new URL('/cable', wsBaseUrl).toString()
    const cable = actionCable.createConsumer(actionCableUrl)
    setChatCable(cable)

    cable.subscriptions.create(
      { channel: 'OnAirChannel', eventAbbr: event?.abbr },
      {
        received: (nextTalk: { [trackId: number]: Talk }) => {
          refetch() // onAirの切り替わった新しいTalk一覧を取得
          dispatch(autoUpdateTalkInLive(nextTalk))
        },
      },
    )
    // TODO reconsider the trigger to re-connect actioncable
  }, [selectedTrack, isLiveMode, selectedTalk])

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()

  useEffect(() => {
    if (!initialized) {
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
  }, [selectedTrack, selectedTalk, initialized])

  if (!initialized) {
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
            changeLiveMode={changeLiveMode}
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
            changeLiveMode={changeLiveMode}
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
